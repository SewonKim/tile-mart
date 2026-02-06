'use server'

import { revalidatePath } from 'next/cache'
import { query, queryOne, transaction } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { Portfolio, PortfolioImage, Tag, PaginatedResult } from '@/lib/types'
import { PAGE_SIZE } from '@/lib/constants'

export async function getPortfolios(params?: {
  page?: number
  search?: string
  serviceId?: number
}): Promise<PaginatedResult<Portfolio>> {
  const page = params?.page || 1
  const offset = (page - 1) * PAGE_SIZE

  let where = 'WHERE 1=1'
  const values: unknown[] = []

  if (params?.search) {
    where += ' AND (p.title LIKE ? OR p.location LIKE ?)'
    values.push(`%${params.search}%`, `%${params.search}%`)
  }
  if (params?.serviceId) {
    where += ' AND p.service_id = ?'
    values.push(params.serviceId)
  }

  const countRows = await query<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM TA_PORTFOLIO_INFO p ${where}`,
    values
  )
  const total = countRows[0]?.total || 0

  const data = await query<Portfolio[]>(
    `SELECT p.*, s.title AS service_name
     FROM TA_PORTFOLIO_INFO p
     LEFT JOIN TA_SERVICE_INFO s ON s.service_id = p.service_id
     ${where}
     ORDER BY p.created_at DESC
     LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    values
  )

  return {
    data,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}

export async function getPortfolio(id: number): Promise<{
  portfolio: Portfolio | null
  images: PortfolioImage[]
  tags: Tag[]
}> {
  const portfolio = await queryOne<Portfolio>(
    `SELECT p.*, s.title AS service_name
     FROM TA_PORTFOLIO_INFO p
     LEFT JOIN TA_SERVICE_INFO s ON s.service_id = p.service_id
     WHERE p.portfolio_id = ?`,
    [id]
  )

  const images = await query<PortfolioImage[]>(
    'SELECT * FROM TA_PORTFOLIO_IMAGE_INFO WHERE portfolio_id = ? ORDER BY sort_order',
    [id]
  )

  const tags = await query<Tag[]>(
    `SELECT t.* FROM TA_TAG_INFO t
     JOIN TA_PORTFOLIO_TAG_INFO pt ON pt.tag_id = t.tag_id
     WHERE pt.portfolio_id = ?`,
    [id]
  )

  return { portfolio, images, tags }
}

export async function createPortfolio(data: {
  service_id: number | null
  title: string
  slug: string
  description: string
  location: string
  area: string
  cost: string
  duration?: string
  thumbnail_url?: string
  is_featured?: boolean
  is_active?: boolean
  completed_at?: string
  images?: { url: string; alt?: string }[]
  tag_ids?: number[]
}): Promise<{ success: boolean; error?: string; id?: number }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  try {
    return await transaction(async (conn) => {
      const [result] = await conn.execute(
        `INSERT INTO TA_PORTFOLIO_INFO
         (service_id, title, slug, description, location, area, cost, duration,
          thumbnail_url, is_featured, is_active, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.service_id,
          data.title,
          data.slug,
          data.description,
          data.location,
          data.area,
          data.cost,
          data.duration || null,
          data.thumbnail_url || null,
          data.is_featured ? 1 : 0,
          data.is_active !== false ? 1 : 0,
          data.completed_at || null,
        ]
      )

      const insertId = (result as { insertId: number }).insertId

      if (data.images?.length) {
        for (let i = 0; i < data.images.length; i++) {
          await conn.execute(
            `INSERT INTO TA_PORTFOLIO_IMAGE_INFO (portfolio_id, image_url, alt_text, sort_order)
             VALUES (?, ?, ?, ?)`,
            [insertId, data.images[i].url, data.images[i].alt || null, i]
          )
        }
      }

      if (data.tag_ids?.length) {
        for (const tagId of data.tag_ids) {
          await conn.execute(
            'INSERT INTO TA_PORTFOLIO_TAG_INFO (portfolio_id, tag_id) VALUES (?, ?)',
            [insertId, tagId]
          )
        }
      }

      revalidatePath('/admin/portfolios')
      return { success: true, id: insertId }
    })
  } catch {
    return { success: false, error: '시공사례 등록에 실패했습니다.' }
  }
}

export async function updatePortfolio(
  id: number,
  data: {
    service_id: number | null
    title: string
    slug: string
    description: string
    location: string
    area: string
    cost: string
    duration?: string
    thumbnail_url?: string
    is_featured?: boolean
    is_active?: boolean
    completed_at?: string
    images?: { url: string; alt?: string }[]
    tag_ids?: number[]
  }
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  try {
    return await transaction(async (conn) => {
      await conn.execute(
        `UPDATE TA_PORTFOLIO_INFO SET
         service_id = ?, title = ?, slug = ?, description = ?,
         location = ?, area = ?, cost = ?, duration = ?,
         thumbnail_url = ?, is_featured = ?, is_active = ?, completed_at = ?
         WHERE portfolio_id = ?`,
        [
          data.service_id,
          data.title,
          data.slug,
          data.description,
          data.location,
          data.area,
          data.cost,
          data.duration || null,
          data.thumbnail_url || null,
          data.is_featured ? 1 : 0,
          data.is_active !== false ? 1 : 0,
          data.completed_at || null,
          id,
        ]
      )

      // Replace images
      await conn.execute('DELETE FROM TA_PORTFOLIO_IMAGE_INFO WHERE portfolio_id = ?', [id])
      if (data.images?.length) {
        for (let i = 0; i < data.images.length; i++) {
          await conn.execute(
            `INSERT INTO TA_PORTFOLIO_IMAGE_INFO (portfolio_id, image_url, alt_text, sort_order)
             VALUES (?, ?, ?, ?)`,
            [id, data.images[i].url, data.images[i].alt || null, i]
          )
        }
      }

      // Replace tags
      await conn.execute('DELETE FROM TA_PORTFOLIO_TAG_INFO WHERE portfolio_id = ?', [id])
      if (data.tag_ids?.length) {
        for (const tagId of data.tag_ids) {
          await conn.execute(
            'INSERT INTO TA_PORTFOLIO_TAG_INFO (portfolio_id, tag_id) VALUES (?, ?)',
            [id, tagId]
          )
        }
      }

      revalidatePath('/admin/portfolios')
      revalidatePath(`/admin/portfolios/${id}/edit`)
      return { success: true }
    })
  } catch {
    return { success: false, error: '시공사례 수정에 실패했습니다.' }
  }
}

export async function deletePortfolio(id: number): Promise<{ success: boolean }> {
  const session = await getSession()
  if (!session) return { success: false }

  await query('DELETE FROM TA_PORTFOLIO_INFO WHERE portfolio_id = ?', [id])
  revalidatePath('/admin/portfolios')
  return { success: true }
}

export async function togglePortfolioFeatured(
  id: number,
  featured: boolean
): Promise<{ success: boolean }> {
  await query('UPDATE TA_PORTFOLIO_INFO SET is_featured = ? WHERE portfolio_id = ?', [featured ? 1 : 0, id])
  revalidatePath('/admin/portfolios')
  return { success: true }
}

export async function togglePortfolioActive(
  id: number,
  active: boolean
): Promise<{ success: boolean }> {
  await query('UPDATE TA_PORTFOLIO_INFO SET is_active = ? WHERE portfolio_id = ?', [active ? 1 : 0, id])
  revalidatePath('/admin/portfolios')
  return { success: true }
}

'use server'

import { revalidatePath } from 'next/cache'
import { query, queryOne, transaction } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { Service, ServiceFeature } from '@/lib/types'

export async function getServicesList(): Promise<Service[]> {
  return query<Service[]>('SELECT * FROM TA_SERVICE_INFO ORDER BY sort_order, service_id')
}

export async function getService(id: number): Promise<{
  service: Service | null
  features: ServiceFeature[]
}> {
  const service = await queryOne<Service>(
    'SELECT * FROM TA_SERVICE_INFO WHERE service_id = ?',
    [id]
  )
  const features = await query<ServiceFeature[]>(
    'SELECT * FROM TA_SERVICE_FEATURE_INFO WHERE service_id = ? ORDER BY sort_order',
    [id]
  )
  return { service, features }
}

export async function createService(data: {
  slug: string
  title: string
  subtitle: string
  tagline: string
  description: string
  image_url?: string
  color: string
  sort_order: number
  is_active: boolean
  features: string[]
}): Promise<{ success: boolean; error?: string; id?: number }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  try {
    return await transaction(async (conn) => {
      const [result] = await conn.execute(
        `INSERT INTO TA_SERVICE_INFO
         (slug, title, subtitle, tagline, description, image_url, color, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.slug, data.title, data.subtitle, data.tagline,
          data.description, data.image_url || null, data.color,
          data.sort_order, data.is_active ? 1 : 0,
        ]
      )

      const insertId = (result as { insertId: number }).insertId

      for (let i = 0; i < data.features.length; i++) {
        if (data.features[i].trim()) {
          await conn.execute(
            'INSERT INTO TA_SERVICE_FEATURE_INFO (service_id, content, sort_order) VALUES (?, ?, ?)',
            [insertId, data.features[i].trim(), i]
          )
        }
      }

      revalidatePath('/admin/services')
      return { success: true, id: insertId }
    })
  } catch {
    return { success: false, error: '서비스 등록에 실패했습니다.' }
  }
}

export async function updateService(
  id: number,
  data: {
    slug: string
    title: string
    subtitle: string
    tagline: string
    description: string
    image_url?: string
    color: string
    sort_order: number
    is_active: boolean
    features: string[]
  }
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  try {
    return await transaction(async (conn) => {
      await conn.execute(
        `UPDATE TA_SERVICE_INFO SET
         slug = ?, title = ?, subtitle = ?, tagline = ?,
         description = ?, image_url = ?, color = ?,
         sort_order = ?, is_active = ?
         WHERE service_id = ?`,
        [
          data.slug, data.title, data.subtitle, data.tagline,
          data.description, data.image_url || null, data.color,
          data.sort_order, data.is_active ? 1 : 0, id,
        ]
      )

      await conn.execute('DELETE FROM TA_SERVICE_FEATURE_INFO WHERE service_id = ?', [id])
      for (let i = 0; i < data.features.length; i++) {
        if (data.features[i].trim()) {
          await conn.execute(
            'INSERT INTO TA_SERVICE_FEATURE_INFO (service_id, content, sort_order) VALUES (?, ?, ?)',
            [id, data.features[i].trim(), i]
          )
        }
      }

      revalidatePath('/admin/services')
      revalidatePath(`/admin/services/${id}/edit`)
      return { success: true }
    })
  } catch {
    return { success: false, error: '서비스 수정에 실패했습니다.' }
  }
}

export async function deleteService(id: number): Promise<{ success: boolean }> {
  const session = await getSession()
  if (!session) return { success: false }

  await query('DELETE FROM TA_SERVICE_INFO WHERE service_id = ?', [id])
  revalidatePath('/admin/services')
  return { success: true }
}

export async function toggleServiceActive(
  id: number,
  active: boolean
): Promise<{ success: boolean }> {
  await query('UPDATE TA_SERVICE_INFO SET is_active = ? WHERE service_id = ?', [active ? 1 : 0, id])
  revalidatePath('/admin/services')
  return { success: true }
}

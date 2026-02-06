'use server'

import { revalidatePath } from 'next/cache'
import { query, queryOne } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { Customer, PaginatedResult } from '@/lib/types'
import { PAGE_SIZE } from '@/lib/constants'

export async function getCustomers(params?: {
  page?: number
  search?: string
}): Promise<PaginatedResult<Customer>> {
  const page = params?.page || 1
  const offset = (page - 1) * PAGE_SIZE

  let where = 'WHERE 1=1'
  const values: unknown[] = []

  if (params?.search) {
    where += ' AND (c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ?)'
    values.push(`%${params.search}%`, `%${params.search}%`, `%${params.search}%`)
  }

  const countRows = await query<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM TA_CUSTOMER_INFO c ${where}`,
    values
  )
  const total = countRows[0]?.total || 0

  const data = await query<Customer[]>(
    `SELECT c.*,
       (SELECT COUNT(*) FROM TA_CONSULTATION_INFO WHERE customer_id = c.customer_id) AS consultation_count
     FROM TA_CUSTOMER_INFO c
     ${where}
     ORDER BY c.created_at DESC
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

export async function getCustomer(id: number): Promise<Customer | null> {
  return queryOne<Customer>(
    'SELECT * FROM TA_CUSTOMER_INFO WHERE customer_id = ?',
    [id]
  )
}

export async function createCustomer(data: {
  name: string
  phone: string
  email?: string
  memo?: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  try {
    await query(
      'INSERT INTO TA_CUSTOMER_INFO (name, phone, email, memo) VALUES (?, ?, ?, ?)',
      [data.name, data.phone, data.email || null, data.memo || null]
    )
    revalidatePath('/admin/customers')
    return { success: true }
  } catch {
    return { success: false, error: '고객 등록에 실패했습니다.' }
  }
}

export async function updateCustomer(
  id: number,
  data: { name: string; phone: string; email?: string; memo?: string }
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  await query(
    'UPDATE TA_CUSTOMER_INFO SET name = ?, phone = ?, email = ?, memo = ? WHERE customer_id = ?',
    [data.name, data.phone, data.email || null, data.memo || null, id]
  )
  revalidatePath('/admin/customers')
  return { success: true }
}

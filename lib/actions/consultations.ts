'use server'

import { revalidatePath } from 'next/cache'
import { query, queryOne, transaction } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { Consultation, ConsultationLog, PaginatedResult, Admin } from '@/lib/types'
import { PAGE_SIZE } from '@/lib/constants'

export async function getConsultations(params: {
  page?: number
  status?: string
  search?: string
  assignedTo?: number
}): Promise<PaginatedResult<Consultation>> {
  const page = params.page || 1
  const offset = (page - 1) * PAGE_SIZE

  let where = 'WHERE 1=1'
  const values: unknown[] = []

  if (params.status) {
    where += ' AND c.status = ?'
    values.push(params.status)
  }
  if (params.search) {
    where += ' AND (c.name LIKE ? OR c.phone LIKE ?)'
    values.push(`%${params.search}%`, `%${params.search}%`)
  }
  if (params.assignedTo) {
    where += ' AND c.assigned_admin_id = ?'
    values.push(params.assignedTo)
  }

  const countRows = await query<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM TA_CONSULTATION_INFO c ${where}`,
    values
  )
  const total = countRows[0]?.total || 0

  const data = await query<Consultation[]>(
    `SELECT c.*, a.name AS admin_name
     FROM TA_CONSULTATION_INFO c
     LEFT JOIN TA_ADMIN_INFO a ON a.admin_id = c.assigned_admin_id
     ${where}
     ORDER BY
       CASE c.status WHEN 'pending' THEN 0 ELSE 1 END,
       c.created_at DESC
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

export async function getConsultation(id: number) {
  const consultation = await queryOne<Consultation>(
    `SELECT c.*, a.name AS admin_name
     FROM TA_CONSULTATION_INFO c
     LEFT JOIN TA_ADMIN_INFO a ON a.admin_id = c.assigned_admin_id
     WHERE c.consultation_id = ?`,
    [id]
  )

  const logs = await query<ConsultationLog[]>(
    `SELECT cl.*, a.name AS admin_name
     FROM TA_CONSULTATION_LOG_INFO cl
     LEFT JOIN TA_ADMIN_INFO a ON a.admin_id = cl.admin_id
     WHERE cl.consultation_id = ?
     ORDER BY cl.created_at DESC`,
    [id]
  )

  return { consultation, logs }
}

export async function updateConsultationStatus(
  id: number,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  try {
    return await transaction(async (conn) => {
      const [rows] = await conn.execute(
        'SELECT status FROM TA_CONSULTATION_INFO WHERE consultation_id = ?',
        [id]
      )
      const current = (rows as { status: string }[])[0]
      if (!current) return { success: false, error: '상담을 찾을 수 없습니다.' }

      await conn.execute(
        'UPDATE TA_CONSULTATION_INFO SET status = ? WHERE consultation_id = ?',
        [newStatus, id]
      )

      await conn.execute(
        `INSERT INTO TA_CONSULTATION_LOG_INFO
         (consultation_id, admin_id, action, prev_status, new_status)
         VALUES (?, ?, 'status_changed', ?, ?)`,
        [id, session.adminId, current.status, newStatus]
      )

      return { success: true }
    })
  } finally {
    revalidatePath('/admin/consultations')
    revalidatePath(`/admin/consultations/${id}`)
  }
}

export async function addConsultationNote(
  id: number,
  note: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  await query(
    `INSERT INTO TA_CONSULTATION_LOG_INFO
     (consultation_id, admin_id, action, note)
     VALUES (?, ?, 'note_added', ?)`,
    [id, session.adminId, note]
  )

  revalidatePath(`/admin/consultations/${id}`)
  return { success: true }
}

export async function assignConsultation(
  id: number,
  adminId: number
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  await query(
    'UPDATE TA_CONSULTATION_INFO SET assigned_admin_id = ? WHERE consultation_id = ?',
    [adminId, id]
  )

  const admin = await queryOne<Admin>(
    'SELECT name FROM TA_ADMIN_INFO WHERE admin_id = ?',
    [adminId]
  )

  await query(
    `INSERT INTO TA_CONSULTATION_LOG_INFO
     (consultation_id, admin_id, action, note)
     VALUES (?, ?, 'assigned', ?)`,
    [id, session.adminId, `담당자 변경: ${admin?.name || '미배정'}`]
  )

  revalidatePath('/admin/consultations')
  revalidatePath(`/admin/consultations/${id}`)
  return { success: true }
}

export async function createConsultation(data: {
  name: string
  phone: string
  space_type: string
  area?: string
  message?: string
  source?: string
}): Promise<{ success: boolean; error?: string; id?: number }> {
  try {
    const result = await query<{ insertId: number }>(
      `INSERT INTO TA_CONSULTATION_INFO (name, phone, space_type, area, message, source)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.name, data.phone, data.space_type, data.area || null, data.message || null, data.source || 'website']
    )

    const insertId = (result as unknown as { insertId: number }).insertId

    await query(
      `INSERT INTO TA_CONSULTATION_LOG_INFO
       (consultation_id, action, note)
       VALUES (?, 'created', '웹사이트에서 상담 신청')`,
      [insertId]
    )

    revalidatePath('/admin/consultations')
    return { success: true, id: insertId }
  } catch {
    return { success: false, error: '상담 등록에 실패했습니다.' }
  }
}

export async function deleteConsultation(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  await query('DELETE FROM TA_CONSULTATION_INFO WHERE consultation_id = ?', [id])
  revalidatePath('/admin/consultations')
  return { success: true }
}

export async function getAdminsList(): Promise<Admin[]> {
  return query<Admin[]>(
    'SELECT admin_id, name, role FROM TA_ADMIN_INFO WHERE is_active = 1 ORDER BY name'
  )
}

'use server'

import { revalidatePath } from 'next/cache'
import { query, queryOne } from '@/lib/db'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import type { Admin } from '@/lib/types'

export async function getAdmins(): Promise<Admin[]> {
  return query<Admin[]>(
    'SELECT admin_id, email, name, role, is_active, last_login_at, created_at FROM TA_ADMIN_INFO ORDER BY admin_id'
  )
}

export async function createAdmin(data: {
  email: string
  password: string
  name: string
  role: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: '권한이 없습니다.' }
  }

  const existing = await queryOne<Admin>(
    'SELECT admin_id FROM TA_ADMIN_INFO WHERE email = ?',
    [data.email]
  )
  if (existing) return { success: false, error: '이미 존재하는 이메일입니다.' }

  const hash = await bcrypt.hash(data.password, 12)
  await query(
    'INSERT INTO TA_ADMIN_INFO (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
    [data.email, hash, data.name, data.role]
  )

  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateAdmin(
  id: number,
  data: { name: string; role: string; email: string }
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: '권한이 없습니다.' }
  }

  await query(
    'UPDATE TA_ADMIN_INFO SET name = ?, role = ?, email = ? WHERE admin_id = ?',
    [data.name, data.role, data.email, id]
  )
  revalidatePath('/admin/users')
  return { success: true }
}

export async function resetAdminPassword(
  id: number,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session || session.role !== 'super_admin') {
    return { success: false, error: '권한이 없습니다.' }
  }

  const hash = await bcrypt.hash(newPassword, 12)
  await query('UPDATE TA_ADMIN_INFO SET password_hash = ? WHERE admin_id = ?', [hash, id])
  revalidatePath('/admin/users')
  return { success: true }
}

export async function toggleAdminActive(
  id: number,
  active: boolean
): Promise<{ success: boolean }> {
  const session = await getSession()
  if (!session || session.role !== 'super_admin') return { success: false }

  await query('UPDATE TA_ADMIN_INFO SET is_active = ? WHERE admin_id = ?', [active ? 1 : 0, id])
  revalidatePath('/admin/users')
  return { success: true }
}

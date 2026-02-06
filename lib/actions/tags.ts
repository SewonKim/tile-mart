'use server'

import { revalidatePath } from 'next/cache'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { Tag } from '@/lib/types'

export async function getTags(): Promise<Tag[]> {
  return query<Tag[]>('SELECT * FROM TA_TAG_INFO ORDER BY name')
}

export async function createTag(
  name: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  try {
    await query('INSERT INTO TA_TAG_INFO (name, slug) VALUES (?, ?)', [name, slug])
    revalidatePath('/admin/tags')
    return { success: true }
  } catch {
    return { success: false, error: '태그 생성에 실패했습니다. 중복된 슬러그일 수 있습니다.' }
  }
}

export async function updateTag(
  id: number,
  name: string,
  slug: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  try {
    await query('UPDATE TA_TAG_INFO SET name = ?, slug = ? WHERE tag_id = ?', [name, slug, id])
    revalidatePath('/admin/tags')
    return { success: true }
  } catch {
    return { success: false, error: '태그 수정에 실패했습니다.' }
  }
}

export async function deleteTag(id: number): Promise<{ success: boolean }> {
  const session = await getSession()
  if (!session) return { success: false }

  await query('DELETE FROM TA_TAG_INFO WHERE tag_id = ?', [id])
  revalidatePath('/admin/tags')
  return { success: true }
}

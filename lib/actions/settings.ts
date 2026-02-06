'use server'

import { revalidatePath } from 'next/cache'
import { query } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { SiteSetting } from '@/lib/types'

export async function getSettings(): Promise<SiteSetting[]> {
  return query<SiteSetting[]>('SELECT * FROM TA_SITE_SETTING_INFO ORDER BY setting_key')
}

export async function updateSettings(
  settings: { key: string; value: string }[]
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession()
  if (!session) return { success: false, error: '인증이 필요합니다.' }

  for (const s of settings) {
    await query(
      'UPDATE TA_SITE_SETTING_INFO SET setting_value = ? WHERE setting_key = ?',
      [s.value, s.key]
    )
  }

  revalidatePath('/admin/settings')
  return { success: true }
}

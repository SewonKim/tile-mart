'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSettings, updateSettings } from '@/lib/actions/settings'
import { useToast } from '@/components/admin/ui/ToastProvider'
import type { SiteSetting } from '@/lib/types'

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const data = await getSettings()
    setSettings(data)
    const v: Record<string, string> = {}
    data.forEach((s) => { v[s.setting_key] = s.setting_value })
    setValues(v)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave() {
    setSaving(true)
    const entries = Object.entries(values).map(([key, value]) => ({ key, value }))
    const res = await updateSettings(entries)
    setSaving(false)
    if (res.success) {
      toast('설정이 저장되었습니다.')
    } else {
      toast(res.error || '오류 발생', 'error')
    }
  }

  const inputClass = 'w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">사이트 설정</h2>
        <p className="text-sm text-muted">회사 정보 및 연락처</p>
      </div>

      <div className="max-w-2xl rounded-xl border border-border bg-white p-6 space-y-4">
        {settings.map((s) => (
          <div key={s.setting_key}>
            <label className="mb-1.5 block text-sm font-medium">
              {s.description || s.setting_key}
            </label>
            {s.setting_key.includes('url') ? (
              <input
                type="url"
                value={values[s.setting_key] || ''}
                onChange={(e) => setValues({ ...values, [s.setting_key]: e.target.value })}
                placeholder="https://..."
                className={inputClass}
              />
            ) : (
              <input
                value={values[s.setting_key] || ''}
                onChange={(e) => setValues({ ...values, [s.setting_key]: e.target.value })}
                className={inputClass}
              />
            )}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? '저장 중...' : '전체 저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

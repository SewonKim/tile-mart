'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAdmins, createAdmin, updateAdmin, toggleAdminActive, resetAdminPassword } from '@/lib/actions/users'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { Modal } from '@/components/admin/ui/Modal'
import { useToast } from '@/components/admin/ui/ToastProvider'
import { ROLE_LABELS } from '@/lib/constants'
import type { Admin } from '@/lib/types'
import { Plus, Eye, EyeOff, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function UsersPage() {
  const { toast } = useToast()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [pwModalOpen, setPwModalOpen] = useState(false)
  const [editing, setEditing] = useState<Admin | null>(null)
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'admin' })
  const [newPw, setNewPw] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const data = await getAdmins()
    setAdmins(data)
  }, [])

  useEffect(() => { load() }, [load])

  function openNew() {
    setEditing(null)
    setForm({ email: '', password: '', name: '', role: 'admin' })
    setModalOpen(true)
  }

  function openEdit(a: Admin) {
    setEditing(a)
    setForm({ email: a.email, password: '', name: a.name, role: a.role })
    setModalOpen(true)
  }

  function openPwReset(a: Admin) {
    setEditing(a)
    setNewPw('')
    setPwModalOpen(true)
  }

  async function handleSave() {
    if (!form.email || !form.name) return
    if (!editing && !form.password) return
    setSaving(true)

    const res = editing
      ? await updateAdmin(editing.admin_id, { name: form.name, role: form.role, email: form.email })
      : await createAdmin({ email: form.email, password: form.password, name: form.name, role: form.role })

    setSaving(false)
    if (res.success) {
      toast(editing ? '관리자 정보가 수정되었습니다.' : '관리자가 생성되었습니다.')
      setModalOpen(false)
      load()
    } else {
      toast(res.error || '오류 발생', 'error')
    }
  }

  async function handlePwReset() {
    if (!editing || !newPw) return
    setSaving(true)
    const res = await resetAdminPassword(editing.admin_id, newPw)
    setSaving(false)
    if (res.success) {
      toast('비밀번호가 변경되었습니다.')
      setPwModalOpen(false)
    } else {
      toast(res.error || '오류 발생', 'error')
    }
  }

  async function handleToggleActive(id: number, current: number) {
    await toggleAdminActive(id, !current)
    toast(current ? '비활성화됨' : '활성화됨')
    load()
  }

  const columns: Column<Admin>[] = [
    { key: 'name', label: '이름', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'email', label: '이메일' },
    {
      key: 'role',
      label: '역할',
      render: (r) => (
        <span className={cn(
          'rounded-full px-2.5 py-0.5 text-xs font-medium',
          r.role === 'super_admin' ? 'bg-red-100 text-red-700' :
          r.role === 'admin' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-600'
        )}>
          {ROLE_LABELS[r.role]}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: '상태',
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(r.admin_id, r.is_active) }}
          className={r.is_active ? 'text-primary' : 'text-gray-300'}
        >
          {r.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      ),
    },
    {
      key: 'last_login_at',
      label: '마지막 로그인',
      render: (r) => r.last_login_at
        ? <span className="text-muted">{new Date(r.last_login_at).toLocaleString('ko-KR')}</span>
        : <span className="text-muted">-</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); openPwReset(r) }}
          className="rounded p-1.5 hover:bg-muted-light"
          title="비밀번호 변경"
        >
          <KeyRound className="size-3.5 text-muted" />
        </button>
      ),
    },
  ]

  const inputClass = 'w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">관리자 계정</h2>
          <p className="text-sm text-muted">{admins.length}명</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="size-4" />
          새 관리자
        </button>
      </div>

      <DataTable<Admin>
        columns={columns}
        data={admins}
        rowKey={(r) => r.admin_id}
        onRowClick={openEdit}
        emptyMessage="관리자가 없습니다."
      />

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '관리자 편집' : '새 관리자'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">이름 *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">이메일 *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          {!editing && (
            <div>
              <label className="mb-1.5 block text-sm font-medium">비밀번호 *</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium">역할</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
              <option value="editor">에디터</option>
              <option value="admin">관리자</option>
              <option value="super_admin">최고관리자</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted-light">취소</button>
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Password Reset Modal */}
      <Modal open={pwModalOpen} onClose={() => setPwModalOpen(false)} title="비밀번호 변경">
        <div className="space-y-4">
          <p className="text-sm text-muted">{editing?.name} ({editing?.email})</p>
          <div>
            <label className="mb-1.5 block text-sm font-medium">새 비밀번호</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className={inputClass} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setPwModalOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted-light">취소</button>
            <button onClick={handlePwReset} disabled={saving || !newPw} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
              {saving ? '변경 중...' : '변경'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCustomers, updateCustomer, createCustomer } from '@/lib/actions/customers'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { Pagination } from '@/components/admin/ui/Pagination'
import { SearchInput } from '@/components/admin/ui/SearchInput'
import { Modal } from '@/components/admin/ui/Modal'
import { useToast } from '@/components/admin/ui/ToastProvider'
import type { Customer, PaginatedResult } from '@/lib/types'
import { Plus } from 'lucide-react'

export default function CustomersPage() {
  const { toast } = useToast()
  const [result, setResult] = useState<PaginatedResult<Customer> | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', memo: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const data = await getCustomers({ page, search: search || undefined })
    setResult(data)
  }, [page, search])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search])

  function openNew() {
    setEditing(null)
    setForm({ name: '', phone: '', email: '', memo: '' })
    setModalOpen(true)
  }

  function openEdit(c: Customer) {
    setEditing(c)
    setForm({ name: c.name, phone: c.phone, email: c.email || '', memo: c.memo || '' })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.phone) return
    setSaving(true)
    const data = { name: form.name, phone: form.phone, email: form.email || undefined, memo: form.memo || undefined }
    const res = editing
      ? await updateCustomer(editing.customer_id, data)
      : await createCustomer(data)
    setSaving(false)
    if (res.success) {
      toast(editing ? '고객 정보가 수정되었습니다.' : '고객이 등록되었습니다.')
      setModalOpen(false)
      load()
    } else {
      toast(res.error || '오류 발생', 'error')
    }
  }

  const columns: Column<Customer>[] = [
    { key: 'name', label: '이름', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'phone', label: '연락처' },
    { key: 'email', label: '이메일', render: (r) => r.email || <span className="text-muted">-</span> },
    {
      key: 'consultation_count',
      label: '상담수',
      render: (r) => (
        <span className="rounded-full bg-muted-light px-2 py-0.5 text-xs font-medium">
          {r.consultation_count || 0}
        </span>
      ),
    },
    {
      key: 'memo',
      label: '메모',
      render: (r) => r.memo ? <span className="text-muted truncate max-w-[200px] inline-block">{r.memo}</span> : '-',
    },
    {
      key: 'created_at',
      label: '등록일',
      render: (r) => <span className="text-muted">{new Date(r.created_at).toLocaleDateString('ko-KR')}</span>,
    },
  ]

  const inputClass = 'w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">고객 관리</h2>
          <p className="text-sm text-muted">총 {result?.total || 0}명</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="size-4" />
          새 고객
        </button>
      </div>

      <div className="max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="이름, 전화번호, 이메일 검색..." />
      </div>

      <DataTable<Customer>
        columns={columns}
        data={result?.data || []}
        rowKey={(r) => r.customer_id}
        onRowClick={openEdit}
        emptyMessage="고객이 없습니다."
      />

      {result && (
        <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '고객 편집' : '새 고객'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">이름 *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">연락처 *</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">이메일</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">메모</label>
            <textarea value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} rows={3} className={inputClass} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted-light">
              취소
            </button>
            <button onClick={handleSave} disabled={saving || !form.name || !form.phone} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

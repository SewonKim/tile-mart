'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getServicesList, deleteService, toggleServiceActive } from '@/lib/actions/services'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { useToast } from '@/components/admin/ui/ToastProvider'
import type { Service } from '@/lib/types'
import { Plus, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'

export default function ServicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])

  const load = useCallback(async () => {
    const data = await getServicesList()
    setServices(data)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleToggleActive(id: number, current: number) {
    await toggleServiceActive(id, !current)
    toast(current ? '비공개 처리' : '공개 처리')
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('이 서비스를 삭제하시겠습니까? 관련 시공사례의 서비스 연결이 해제됩니다.')) return
    await deleteService(id)
    toast('삭제되었습니다.')
    load()
  }

  const columns: Column<Service>[] = [
    {
      key: 'color',
      label: '',
      render: (r) => (
        <div className="size-6 rounded" style={{ backgroundColor: r.color }} />
      ),
      width: '40px',
    },
    {
      key: 'title',
      label: '서비스명',
      render: (r) => (
        <div>
          <p className="font-medium">{r.title}</p>
          <p className="text-xs text-muted">{r.subtitle}</p>
        </div>
      ),
    },
    { key: 'slug', label: '슬러그' },
    { key: 'tagline', label: '한줄소개', render: (r) => <span className="text-muted">{r.tagline}</span> },
    { key: 'sort_order', label: '순서' },
    {
      key: 'is_active',
      label: '공개',
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(r.service_id, r.is_active) }}
          className={r.is_active ? 'text-primary' : 'text-gray-300'}
        >
          {r.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Link href={`/admin/services/${r.service_id}/edit`} className="rounded p-1.5 hover:bg-muted-light">
            <Pencil className="size-3.5 text-muted" />
          </Link>
          <button onClick={() => handleDelete(r.service_id)} className="rounded p-1.5 hover:bg-red-50">
            <Trash2 className="size-3.5 text-red-400" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">서비스 관리</h2>
          <p className="text-sm text-muted">{services.length}개 서비스</p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="size-4" />
          새 서비스
        </Link>
      </div>

      <DataTable<Service>
        columns={columns}
        data={services}
        rowKey={(r) => r.service_id}
        onRowClick={(r) => router.push(`/admin/services/${r.service_id}/edit`)}
        emptyMessage="서비스가 없습니다."
      />
    </div>
  )
}

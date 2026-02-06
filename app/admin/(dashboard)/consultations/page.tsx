'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getConsultations } from '@/lib/actions/consultations'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { Pagination } from '@/components/admin/ui/Pagination'
import { SearchInput } from '@/components/admin/ui/SearchInput'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { cn } from '@/lib/utils'
import {
  STATUS_LABELS,
  SPACE_TYPE_LABELS,
  SOURCE_LABELS,
} from '@/lib/constants'
import type { Consultation, PaginatedResult } from '@/lib/types'

const STATUSES = ['all', 'pending', 'contacted', 'visiting', 'quoted', 'contracted', 'cancelled']

export default function ConsultationsPage() {
  const router = useRouter()
  const [result, setResult] = useState<PaginatedResult<Consultation> | null>(null)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    const data = await getConsultations({
      page,
      status: status === 'all' ? undefined : status,
      search: search || undefined,
    })
    setResult(data)
  }, [page, status, search])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [status, search])

  const columns: Column<Consultation>[] = [
    { key: 'name', label: '이름', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'phone', label: '연락처' },
    {
      key: 'space_type',
      label: '공간유형',
      render: (r) => SPACE_TYPE_LABELS[r.space_type] || r.space_type,
    },
    { key: 'area', label: '면적', render: (r) => r.area || '-' },
    {
      key: 'status',
      label: '상태',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'source',
      label: '유입경로',
      render: (r) => <span className="text-muted">{SOURCE_LABELS[r.source] || r.source}</span>,
    },
    {
      key: 'admin_name',
      label: '담당자',
      render: (r) => r.admin_name || <span className="text-muted">-</span>,
    },
    {
      key: 'created_at',
      label: '신청일',
      render: (r) => (
        <span className="text-muted">
          {new Date(r.created_at).toLocaleDateString('ko-KR')}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">상담 관리</h2>
          <p className="text-sm text-muted">
            총 {result?.total || 0}건
          </p>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              status === s
                ? 'bg-primary text-white'
                : 'bg-white text-foreground/70 hover:bg-muted-light border border-border'
            )}
          >
            {s === 'all' ? '전체' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="max-w-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="이름 또는 전화번호 검색..."
        />
      </div>

      <DataTable<Consultation>
        columns={columns}
        data={result?.data || []}
        rowKey={(r) => r.consultation_id}
        onRowClick={(r) => router.push(`/admin/consultations/${r.consultation_id}`)}
        emptyMessage="상담 내역이 없습니다."
      />

      {result && (
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

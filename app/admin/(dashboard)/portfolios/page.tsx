'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPortfolios, togglePortfolioFeatured, togglePortfolioActive, deletePortfolio } from '@/lib/actions/portfolios'
import { DataTable, type Column } from '@/components/admin/ui/DataTable'
import { Pagination } from '@/components/admin/ui/Pagination'
import { SearchInput } from '@/components/admin/ui/SearchInput'
import { useToast } from '@/components/admin/ui/ToastProvider'
import type { Portfolio, PaginatedResult } from '@/lib/types'
import { Plus, Star, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'

export default function PortfoliosPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [result, setResult] = useState<PaginatedResult<Portfolio> | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    const data = await getPortfolios({ page, search: search || undefined })
    setResult(data)
  }, [page, search])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search])

  async function handleToggleFeatured(id: number, current: number) {
    await togglePortfolioFeatured(id, !current)
    toast(current ? '추천 해제' : '추천 설정')
    load()
  }

  async function handleToggleActive(id: number, current: number) {
    await togglePortfolioActive(id, !current)
    toast(current ? '비공개 처리' : '공개 처리')
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('이 시공사례를 삭제하시겠습니까?')) return
    await deletePortfolio(id)
    toast('삭제되었습니다.')
    load()
  }

  const columns: Column<Portfolio>[] = [
    {
      key: 'title',
      label: '제목',
      render: (r) => (
        <div>
          <p className="font-medium">{r.title}</p>
          <p className="text-xs text-muted">{r.location}</p>
        </div>
      ),
    },
    { key: 'service_name', label: '서비스', render: (r) => r.service_name || '-' },
    { key: 'area', label: '면적' },
    { key: 'cost', label: '시공비' },
    {
      key: 'is_featured',
      label: '추천',
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleFeatured(r.portfolio_id, r.is_featured) }}
          className={r.is_featured ? 'text-yellow-500' : 'text-gray-300'}
        >
          <Star className="size-4" fill={r.is_featured ? 'currentColor' : 'none'} />
        </button>
      ),
    },
    {
      key: 'is_active',
      label: '공개',
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(r.portfolio_id, r.is_active) }}
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
          <Link
            href={`/admin/portfolios/${r.portfolio_id}/edit`}
            className="rounded p-1.5 hover:bg-muted-light"
          >
            <Pencil className="size-3.5 text-muted" />
          </Link>
          <button
            onClick={() => handleDelete(r.portfolio_id)}
            className="rounded p-1.5 hover:bg-red-50"
          >
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
          <h2 className="text-xl font-bold text-foreground">시공사례</h2>
          <p className="text-sm text-muted">총 {result?.total || 0}건</p>
        </div>
        <Link
          href="/admin/portfolios/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="size-4" />
          새 시공사례
        </Link>
      </div>

      <div className="max-w-sm">
        <SearchInput value={search} onChange={setSearch} placeholder="제목 또는 위치 검색..." />
      </div>

      <DataTable<Portfolio>
        columns={columns}
        data={result?.data || []}
        rowKey={(r) => r.portfolio_id}
        onRowClick={(r) => router.push(`/admin/portfolios/${r.portfolio_id}/edit`)}
        emptyMessage="시공사례가 없습니다."
      />

      {result && (
        <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}

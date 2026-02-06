'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getPortfolio, updatePortfolio } from '@/lib/actions/portfolios'
import { getTags } from '@/lib/actions/tags'
import { useToast } from '@/components/admin/ui/ToastProvider'
import { PortfolioForm } from '@/components/admin/forms/PortfolioForm'
import type { Tag, Service, Portfolio, PortfolioImage } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditPortfolioPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [images, setImages] = useState<PortfolioImage[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPortfolio(Number(id)),
      getTags(),
      import('@/lib/actions/services').then((mod) => mod.getServicesList()),
    ]).then(([data, tagList, serviceList]) => {
      setPortfolio(data.portfolio)
      setImages(data.images)
      setSelectedTags(data.tags)
      setTags(tagList)
      setServices(serviceList)
      setLoading(false)
    })
  }, [id])

  async function handleSubmit(data: Parameters<typeof updatePortfolio>[1]) {
    setSaving(true)
    const res = await updatePortfolio(Number(id), data)
    setSaving(false)
    if (res.success) {
      toast('시공사례가 수정되었습니다.')
      router.push('/admin/portfolios')
    } else {
      toast(res.error || '오류가 발생했습니다.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!portfolio) {
    return <div className="py-20 text-center text-muted">시공사례를 찾을 수 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/portfolios" className="rounded-lg p-2 hover:bg-muted-light">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-xl font-bold text-foreground">시공사례 편집</h2>
      </div>
      <PortfolioForm
        portfolio={portfolio}
        existingImages={images}
        existingTags={selectedTags}
        tags={tags}
        services={services}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  )
}

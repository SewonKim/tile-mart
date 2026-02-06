'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPortfolio } from '@/lib/actions/portfolios'
import { getTags } from '@/lib/actions/tags'
import { useToast } from '@/components/admin/ui/ToastProvider'
import { PortfolioForm } from '@/components/admin/forms/PortfolioForm'
import type { Tag, Service } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPortfolioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [tags, setTags] = useState<Tag[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getTags().then(setTags)
    import('@/lib/actions/services').then((mod) => mod.getServicesList().then(setServices))
  }, [])

  async function handleSubmit(data: Parameters<typeof createPortfolio>[0]) {
    setSaving(true)
    const res = await createPortfolio(data)
    setSaving(false)
    if (res.success) {
      toast('시공사례가 등록되었습니다.')
      router.push('/admin/portfolios')
    } else {
      toast(res.error || '오류가 발생했습니다.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/portfolios" className="rounded-lg p-2 hover:bg-muted-light">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-xl font-bold text-foreground">새 시공사례</h2>
      </div>
      <PortfolioForm
        tags={tags}
        services={services}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  )
}

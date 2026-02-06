'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getService, updateService } from '@/lib/actions/services'
import { useToast } from '@/components/admin/ui/ToastProvider'
import { ServiceForm } from '@/components/admin/forms/ServiceForm'
import type { Service, ServiceFeature } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [service, setService] = useState<Service | null>(null)
  const [features, setFeatures] = useState<ServiceFeature[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getService(Number(id)).then((data) => {
      setService(data.service)
      setFeatures(data.features)
      setLoading(false)
    })
  }, [id])

  async function handleSubmit(data: Parameters<typeof updateService>[1]) {
    setSaving(true)
    const res = await updateService(Number(id), data)
    setSaving(false)
    if (res.success) {
      toast('서비스가 수정되었습니다.')
      router.push('/admin/services')
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

  if (!service) {
    return <div className="py-20 text-center text-muted">서비스를 찾을 수 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/services" className="rounded-lg p-2 hover:bg-muted-light">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-xl font-bold text-foreground">서비스 편집</h2>
      </div>
      <ServiceForm
        service={service}
        existingFeatures={features}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  )
}

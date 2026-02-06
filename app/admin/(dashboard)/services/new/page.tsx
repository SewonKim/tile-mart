'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createService } from '@/lib/actions/services'
import { useToast } from '@/components/admin/ui/ToastProvider'
import { ServiceForm } from '@/components/admin/forms/ServiceForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewServicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(data: Parameters<typeof createService>[0]) {
    setSaving(true)
    const res = await createService(data)
    setSaving(false)
    if (res.success) {
      toast('서비스가 등록되었습니다.')
      router.push('/admin/services')
    } else {
      toast(res.error || '오류가 발생했습니다.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/services" className="rounded-lg p-2 hover:bg-muted-light">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-xl font-bold text-foreground">새 서비스</h2>
      </div>
      <ServiceForm onSubmit={handleSubmit} saving={saving} />
    </div>
  )
}

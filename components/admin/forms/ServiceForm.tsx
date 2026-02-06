'use client'

import { useState } from 'react'
import { generateSlug } from '@/lib/validators'
import type { Service, ServiceFeature } from '@/lib/types'
import { Plus, X } from 'lucide-react'

interface ServiceFormProps {
  service?: Service | null
  existingFeatures?: ServiceFeature[]
  onSubmit: (data: {
    slug: string
    title: string
    subtitle: string
    tagline: string
    description: string
    image_url?: string
    color: string
    sort_order: number
    is_active: boolean
    features: string[]
  }) => void
  saving: boolean
}

export function ServiceForm({ service, existingFeatures, onSubmit, saving }: ServiceFormProps) {
  const [title, setTitle] = useState(service?.title || '')
  const [slug, setSlug] = useState(service?.slug || '')
  const [subtitle, setSubtitle] = useState(service?.subtitle || '')
  const [tagline, setTagline] = useState(service?.tagline || '')
  const [description, setDescription] = useState(service?.description || '')
  const [imageUrl, setImageUrl] = useState(service?.image_url || '')
  const [color, setColor] = useState(service?.color || '#55c89f')
  const [sortOrder, setSortOrder] = useState(service?.sort_order || 0)
  const [isActive, setIsActive] = useState(service?.is_active !== 0)
  const [features, setFeatures] = useState<string[]>(
    existingFeatures?.map((f) => f.content) || ['']
  )

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!service) setSlug(generateSlug(val))
  }

  function addFeature() {
    setFeatures((prev) => [...prev, ''])
  }

  function removeFeature(idx: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateFeature(idx: number, val: string) {
    setFeatures((prev) => prev.map((f, i) => (i === idx ? val : f)))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      slug,
      title,
      subtitle,
      tagline,
      description,
      image_url: imageUrl || undefined,
      color,
      sort_order: sortOrder,
      is_active: isActive,
      features: features.filter((f) => f.trim()),
    })
  }

  const inputClass = 'w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">기본 정보</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">서비스명 *</label>
            <input value={title} onChange={(e) => handleTitleChange(e.target.value)} required className={inputClass} placeholder="사무실" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">슬러그 *</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={inputClass} placeholder="office" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">영문 표기 *</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required className={inputClass} placeholder="OFFICE" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">한줄 소개 *</label>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} required className={inputClass} placeholder="업무 효율을 높이는 공간" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">설명 *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={inputClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">이미지 URL</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">브랜드 컬러</label>
            <div className="flex gap-2">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-12 rounded border border-border" />
              <input value={color} onChange={(e) => setColor(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">정렬 순서</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputClass} min={0} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-primary" />
          공개
        </label>
      </div>

      {/* Features */}
      <div className="rounded-xl border border-border bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">서비스 특징</h3>
          <button type="button" onClick={addFeature} className="flex items-center gap-1 text-sm text-primary hover:underline">
            <Plus className="size-3.5" /> 항목 추가
          </button>
        </div>
        <div className="space-y-2">
          {features.map((f, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={f}
                onChange={(e) => updateFeature(idx, e.target.value)}
                placeholder={`특징 ${idx + 1}`}
                className={`${inputClass} flex-1`}
              />
              {features.length > 1 && (
                <button type="button" onClick={() => removeFeature(idx)} className="rounded p-2 hover:bg-red-50">
                  <X className="size-4 text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
          {saving ? '저장 중...' : service ? '수정' : '등록'}
        </button>
      </div>
    </form>
  )
}

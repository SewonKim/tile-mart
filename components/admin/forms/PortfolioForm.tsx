'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { generateSlug } from '@/lib/validators'
import type { Portfolio, PortfolioImage, Tag, Service } from '@/lib/types'
import { Plus, X, GripVertical } from 'lucide-react'

interface PortfolioFormProps {
  portfolio?: Portfolio | null
  existingImages?: PortfolioImage[]
  existingTags?: Tag[]
  tags: Tag[]
  services: Service[]
  onSubmit: (data: {
    service_id: number | null
    title: string
    slug: string
    description: string
    location: string
    area: string
    cost: string
    duration?: string
    thumbnail_url?: string
    is_featured?: boolean
    is_active?: boolean
    completed_at?: string
    images?: { url: string; alt?: string }[]
    tag_ids?: number[]
  }) => void
  saving: boolean
}

export function PortfolioForm({
  portfolio,
  existingImages,
  existingTags,
  tags,
  services,
  onSubmit,
  saving,
}: PortfolioFormProps) {
  const [title, setTitle] = useState(portfolio?.title || '')
  const [slug, setSlug] = useState(portfolio?.slug || '')
  const [serviceId, setServiceId] = useState<number | null>(portfolio?.service_id || null)
  const [description, setDescription] = useState(portfolio?.description || '')
  const [location, setLocation] = useState(portfolio?.location || '')
  const [area, setArea] = useState(portfolio?.area || '')
  const [cost, setCost] = useState(portfolio?.cost || '')
  const [duration, setDuration] = useState(portfolio?.duration || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(portfolio?.thumbnail_url || '')
  const [isFeatured, setIsFeatured] = useState(!!portfolio?.is_featured)
  const [isActive, setIsActive] = useState(portfolio?.is_active !== 0)
  const [completedAt, setCompletedAt] = useState(portfolio?.completed_at?.slice(0, 10) || '')
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    existingImages?.map((img) => ({ url: img.image_url, alt: img.alt_text || '' })) || []
  )
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    existingTags?.map((t) => t.tag_id) || []
  )
  const [newImageUrl, setNewImageUrl] = useState('')

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!portfolio) {
      setSlug(generateSlug(val))
    }
  }

  function addImage() {
    if (!newImageUrl.trim()) return
    setImages((prev) => [...prev, { url: newImageUrl.trim(), alt: '' }])
    setNewImageUrl('')
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      service_id: serviceId,
      title,
      slug,
      description,
      location,
      area,
      cost,
      duration: duration || undefined,
      thumbnail_url: thumbnailUrl || images[0]?.url || undefined,
      is_featured: isFeatured,
      is_active: isActive,
      completed_at: completedAt || undefined,
      images,
      tag_ids: selectedTagIds,
    })
  }

  const inputClass = 'w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">기본 정보</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">제목 *</label>
            <input value={title} onChange={(e) => handleTitleChange(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">슬러그 *</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">서비스 카테고리</label>
          <select
            value={serviceId || ''}
            onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : null)}
            className={inputClass}
          >
            <option value="">선택안함</option>
            {services.map((s) => (
              <option key={s.service_id} value={s.service_id}>{s.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">설명 *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">위치 *</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} required className={inputClass} placeholder="서울 강남구" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">면적 *</label>
            <input value={area} onChange={(e) => setArea(e.target.value)} required className={inputClass} placeholder="52평" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">시공비 *</label>
            <input value={cost} onChange={(e) => setCost(e.target.value)} required className={inputClass} placeholder="4,200만원" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">시공기간</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="4주" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">시공완료일</label>
            <input type="date" value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">대표 이미지 URL</label>
            <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className={inputClass} placeholder="https://..." />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-primary" />
            메인 추천
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-primary" />
            공개
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border border-border bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">갤러리 이미지</h3>
        <div className="flex gap-2">
          <input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="이미지 URL 입력..."
            className={cn(inputClass, 'flex-1')}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
          />
          <button type="button" onClick={addImage} className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark">
            <Plus className="size-4" />
          </button>
        </div>
        {images.length > 0 && (
          <div className="space-y-2">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-lg border border-border bg-muted-light p-2">
                <GripVertical className="size-4 text-muted" />
                <span className="flex-1 truncate text-sm">{img.url}</span>
                <button type="button" onClick={() => removeImage(idx)} className="rounded p-1 hover:bg-red-50">
                  <X className="size-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="rounded-xl border border-border bg-white p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">태그</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.tag_id}
              type="button"
              onClick={() => toggleTag(tag.tag_id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                selectedTagIds.includes(tag.tag_id)
                  ? 'bg-primary text-white'
                  : 'bg-muted-light text-foreground/70 hover:bg-gray-200'
              )}
            >
              {tag.name}
            </button>
          ))}
          {tags.length === 0 && <p className="text-sm text-muted">태그가 없습니다. 태그 관리에서 먼저 추가해주세요.</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50">
          {saving ? '저장 중...' : portfolio ? '수정' : '등록'}
        </button>
      </div>
    </form>
  )
}

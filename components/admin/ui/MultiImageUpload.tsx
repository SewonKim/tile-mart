'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageItem {
  url: string
  alt: string
}

interface MultiImageUploadProps {
  images: ImageItem[]
  onChange: (images: ImageItem[]) => void
  folder?: string
  label?: string
}

export function MultiImageUpload({
  images,
  onChange,
  folder = 'general',
  label = '갤러리 이미지',
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || '업로드 실패')
          return
        }

        onChange([...images, { url: data.url, alt: '' }])
      } catch {
        setError('네트워크 오류가 발생했습니다.')
      } finally {
        setIsUploading(false)
      }
    },
    [folder, images, onChange]
  )

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('5MB 이하 파일만 업로드 가능합니다.')
        return
      }
      upload(file)
    },
    [upload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* 업로드된 이미지 그리드 */}
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border"
            >
              <Image
                src={img.url}
                alt={img.alt || `이미지 ${i + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
              <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {i + 1}
              </span>
            </div>
          ))}

          {/* 추가 버튼 */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted transition-colors hover:border-primary/50 hover:bg-muted-light disabled:opacity-60"
          >
            {isUploading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <Plus className="size-6" />
            )}
            <span className="mt-1 text-xs">추가</span>
          </button>
        </div>
      )}

      {/* 이미지가 없을 때 드래그 영역 */}
      {images.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors',
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted-light',
            isUploading && 'pointer-events-none opacity-60'
          )}
        >
          {isUploading ? (
            <Loader2 className="size-8 animate-spin text-primary" />
          ) : (
            <Upload className="size-8 text-muted" />
          )}
          <p className="mt-2 text-sm font-medium text-muted">
            {isUploading ? '업로드 중...' : '클릭 또는 드래그하여 업로드'}
          </p>
          <p className="mt-1 text-xs text-muted/60">
            JPG, PNG, WebP, GIF (최대 5MB)
          </p>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

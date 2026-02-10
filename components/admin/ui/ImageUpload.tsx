'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

export function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label = '이미지 업로드',
}: ImageUploadProps) {
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

        onChange(data.url)
      } catch {
        setError('네트워크 오류가 발생했습니다.')
      } finally {
        setIsUploading(false)
      }
    },
    [folder, onChange]
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

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>

      {value ? (
        <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border">
          <Image
            src={value}
            alt="업로드된 이미지"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
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

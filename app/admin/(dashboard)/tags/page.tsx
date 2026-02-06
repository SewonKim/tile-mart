'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTags, createTag, updateTag, deleteTag } from '@/lib/actions/tags'
import { useToast } from '@/components/admin/ui/ToastProvider'
import { generateSlug } from '@/lib/validators'
import type { Tag } from '@/lib/types'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

export default function TagsPage() {
  const { toast } = useToast()
  const [tags, setTags] = useState<Tag[]>([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const load = useCallback(async () => {
    const data = await getTags()
    setTags(data)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate() {
    if (!newName.trim()) return
    const slug = generateSlug(newName)
    const res = await createTag(newName.trim(), slug)
    if (res.success) {
      toast('태그가 생성되었습니다.')
      setNewName('')
      load()
    } else {
      toast(res.error || '오류 발생', 'error')
    }
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return
    const slug = generateSlug(editName)
    const res = await updateTag(id, editName.trim(), slug)
    if (res.success) {
      toast('태그가 수정되었습니다.')
      setEditingId(null)
      load()
    } else {
      toast(res.error || '오류 발생', 'error')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('이 태그를 삭제하시겠습니까?')) return
    await deleteTag(id)
    toast('태그가 삭제되었습니다.')
    load()
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">태그 관리</h2>
        <p className="text-sm text-muted">시공사례 필터링에 사용되는 태그</p>
      </div>

      <div className="flex gap-2 max-w-md">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 태그 이름..."
          className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button
          onClick={handleCreate}
          disabled={!newName.trim()}
          className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          <Plus className="size-4" />
          추가
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white">
        {tags.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted">태그가 없습니다.</div>
        ) : (
          <div className="divide-y divide-border">
            {tags.map((tag) => (
              <div key={tag.tag_id} className="flex items-center gap-3 px-4 py-3">
                {editingId === tag.tag_id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 rounded border border-border px-2 py-1 text-sm outline-none focus:border-primary"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate(tag.tag_id)}
                    />
                    <button onClick={() => handleUpdate(tag.tag_id)} className="rounded p-1 hover:bg-green-50">
                      <Check className="size-4 text-green-600" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="rounded p-1 hover:bg-muted-light">
                      <X className="size-4 text-muted" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium">{tag.name}</span>
                    <span className="text-xs text-muted">{tag.slug}</span>
                    <button
                      onClick={() => { setEditingId(tag.tag_id); setEditName(tag.name) }}
                      className="rounded p-1 hover:bg-muted-light"
                    >
                      <Pencil className="size-3.5 text-muted" />
                    </button>
                    <button onClick={() => handleDelete(tag.tag_id)} className="rounded p-1 hover:bg-red-50">
                      <Trash2 className="size-3.5 text-red-400" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

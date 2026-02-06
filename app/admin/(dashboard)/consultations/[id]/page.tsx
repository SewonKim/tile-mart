'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getConsultation,
  updateConsultationStatus,
  addConsultationNote,
  assignConsultation,
  deleteConsultation,
  getAdminsList,
} from '@/lib/actions/consultations'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { useToast } from '@/components/admin/ui/ToastProvider'
import {
  STATUS_LABELS,
  SPACE_TYPE_LABELS,
  SOURCE_LABELS,
  LOG_ACTION_LABELS,
} from '@/lib/constants'
import type { Consultation, ConsultationLog, Admin } from '@/lib/types'
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'

export default function ConsultationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [logs, setLogs] = useState<ConsultationLog[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const data = await getConsultation(Number(id))
    setConsultation(data.consultation)
    setLogs(data.logs)
    const adminList = await getAdminsList()
    setAdmins(adminList)
    setLoading(false)
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  async function handleStatusChange(newStatus: string) {
    const res = await updateConsultationStatus(Number(id), newStatus)
    if (res.success) {
      toast('상태가 변경되었습니다.')
      load()
    } else {
      toast(res.error || '오류가 발생했습니다.', 'error')
    }
  }

  async function handleAssign(adminId: number) {
    const res = await assignConsultation(Number(id), adminId)
    if (res.success) {
      toast('담당자가 변경되었습니다.')
      load()
    } else {
      toast(res.error || '오류가 발생했습니다.', 'error')
    }
  }

  async function handleAddNote() {
    if (!note.trim()) return
    const res = await addConsultationNote(Number(id), note)
    if (res.success) {
      toast('메모가 추가되었습니다.')
      setNote('')
      load()
    } else {
      toast(res.error || '오류가 발생했습니다.', 'error')
    }
  }

  async function handleDelete() {
    if (!confirm('이 상담을 삭제하시겠습니까?')) return
    const res = await deleteConsultation(Number(id))
    if (res.success) {
      toast('상담이 삭제되었습니다.')
      router.push('/admin/consultations')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!consultation) {
    return <div className="py-20 text-center text-muted">상담을 찾을 수 없습니다.</div>
  }

  const c = consultation

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/consultations" className="rounded-lg p-2 hover:bg-muted-light">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{c.name}</h2>
          <p className="text-sm text-muted">
            {new Date(c.created_at).toLocaleString('ko-KR')}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
          title="삭제"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info Card */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="size-4 text-muted" />
                <div>
                  <p className="text-xs text-muted">이름</p>
                  <p className="font-medium">{c.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted" />
                <div>
                  <p className="text-xs text-muted">연락처</p>
                  <p className="font-medium">{c.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-muted" />
                <div>
                  <p className="text-xs text-muted">공간유형</p>
                  <p className="font-medium">
                    {SPACE_TYPE_LABELS[c.space_type]} {c.area && `/ ${c.area}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-4 text-muted" />
                <div>
                  <p className="text-xs text-muted">유입경로</p>
                  <p className="font-medium">{SOURCE_LABELS[c.source]}</p>
                </div>
              </div>
            </div>
            {c.message && (
              <div className="mt-4 rounded-lg bg-muted-light p-4">
                <p className="text-xs font-medium text-muted">요청사항</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{c.message}</p>
              </div>
            )}
          </div>

          {/* Log Timeline */}
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground">진행 기록</h3>

            {/* Add Note */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="메모 입력..."
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={!note.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
              >
                추가
              </button>
            </div>

            {logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.log_id} className="flex gap-3">
                    <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {LOG_ACTION_LABELS[log.action]}
                        </span>
                        {log.prev_status && log.new_status && (
                          <span className="text-xs text-muted">
                            {STATUS_LABELS[log.prev_status]} &rarr; {STATUS_LABELS[log.new_status]}
                          </span>
                        )}
                      </div>
                      {log.note && (
                        <p className="mt-0.5 text-sm text-foreground/80">{log.note}</p>
                      )}
                      <p className="mt-0.5 text-xs text-muted">
                        {log.admin_name || '시스템'} &middot;{' '}
                        {new Date(log.created_at).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">기록이 없습니다.</p>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">상태</h3>
            <div className="mb-3">
              <StatusBadge status={c.status} />
            </div>
            <select
              value={c.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">담당자</h3>
            <p className="mb-2 text-sm">{c.admin_name || '미배정'}</p>
            <select
              value={c.assigned_admin_id || ''}
              onChange={(e) => handleAssign(Number(e.target.value))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">미배정</option>
              {admins.map((a) => (
                <option key={a.admin_id} value={a.admin_id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

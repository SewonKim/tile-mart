'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Menu, LogOut } from 'lucide-react'
import { ROLE_LABELS } from '@/lib/constants'
import type { SessionPayload } from '@/lib/types'

interface AdminHeaderProps {
  session: SessionPayload
  onMenuToggle: () => void
}

const BREADCRUMB_MAP: Record<string, string> = {
  '/admin': '대시보드',
  '/admin/consultations': '상담 관리',
  '/admin/customers': '고객 관리',
  '/admin/portfolios': '시공사례',
  '/admin/services': '서비스',
  '/admin/tags': '태그',
  '/admin/settings': '사이트 설정',
  '/admin/users': '관리자 계정',
}

export function AdminHeader({ session, onMenuToggle }: AdminHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const breadcrumb =
    BREADCRUMB_MAP[pathname] ||
    Object.entries(BREADCRUMB_MAP).find(([path]) => pathname.startsWith(path))?.[1] ||
    ''

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 hover:bg-muted-light lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-sm font-semibold text-foreground">
          {breadcrumb}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{session.name}</p>
          <p className="text-xs text-muted">{ROLE_LABELS[session.role]}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
          title="로그아웃"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Layers,
  Tags,
  Users,
  Settings,
  Shield,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdminRole } from '@/lib/types'

interface AdminSidebarProps {
  role: AdminRole
  open: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { label: '대시보드', href: '/admin', icon: LayoutDashboard },
  { section: '업무' },
  { label: '상담 관리', href: '/admin/consultations', icon: MessageSquare },
  { label: '고객 관리', href: '/admin/customers', icon: Users },
  { section: '콘텐츠' },
  { label: '시공사례', href: '/admin/portfolios', icon: Briefcase },
  { label: '서비스', href: '/admin/services', icon: Layers },
  { label: '태그', href: '/admin/tags', icon: Tags },
  { section: '시스템' },
  { label: '사이트 설정', href: '/admin/settings', icon: Settings },
  { label: '관리자 계정', href: '/admin/users', icon: Shield, role: 'super_admin' as AdminRole },
]

export function AdminSidebar({ role, open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r border-border bg-white transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin" className="text-lg font-bold text-foreground">
            타일마트 <span className="text-sm font-normal text-muted">CMS</span>
          </Link>
          <button onClick={onClose} className="lg:hidden">
            <X className="size-5 text-muted" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item, i) => {
            if ('section' in item) {
              return (
                <p key={i} className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  {item.section}
                </p>
              )
            }

            if (item.role && item.role !== role) return null

            const Icon = item.icon!
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href!)

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onClose}
                className={cn(
                  'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-muted-light hover:text-foreground'
                )}
              >
                <Icon className="size-[18px]" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <Link
            href="/"
            target="_blank"
            className="block text-center text-xs text-muted hover:text-foreground"
          >
            사이트 보기 &rarr;
          </Link>
        </div>
      </aside>
    </>
  )
}

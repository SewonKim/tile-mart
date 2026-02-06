'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { AdminHeader } from '@/components/admin/layout/AdminHeader'
import { ToastProvider } from '@/components/admin/ui/ToastProvider'
import type { SessionPayload } from '@/lib/types'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [session, setSession] = useState<SessionPayload | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.session) setSession(data.session)
      })
      .catch(() => {})
  }, [])

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar
          role={session.role}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-1 flex-col">
          <AdminHeader
            session={session}
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  )
}

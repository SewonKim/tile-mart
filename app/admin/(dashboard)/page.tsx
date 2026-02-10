import { getDashboardStats } from '@/lib/actions/dashboard'
import { StatCard } from '@/components/admin/ui/StatCard'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { SPACE_TYPE_LABELS } from '@/lib/constants'
import {
  MessageSquare,
  Clock,
  Phone,
  CheckCircle,
  Briefcase,
  Users,
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  let stats
  try {
    stats = await getDashboardStats()
  } catch {
    stats = null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">대시보드</h2>
        <p className="text-sm text-muted">타일마트 관리 현황</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="전체 상담"
          value={stats?.totalConsultations || 0}
          icon={MessageSquare}
        />
        <StatCard
          label="대기중"
          value={stats?.pendingCount || 0}
          icon={Clock}
          color="text-yellow-600"
          sub="빠른 응대가 필요합니다"
        />
        <StatCard
          label="연락완료"
          value={stats?.contactedCount || 0}
          icon={Phone}
          color="text-blue-600"
        />
        <StatCard
          label="계약완료"
          value={stats?.contractedCount || 0}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          label="시공사례"
          value={stats?.totalPortfolios || 0}
          icon={Briefcase}
        />
        <StatCard
          label="고객수"
          value={stats?.totalCustomers || 0}
          icon={Users}
        />
      </div>

      <div className="rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">최근 상담</h3>
          <Link
            href="/admin/consultations"
            className="text-xs font-medium text-primary hover:underline"
          >
            전체보기 &rarr;
          </Link>
        </div>
        {stats?.recentConsultations && stats.recentConsultations.length > 0 ? (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="whitespace-nowrap px-5 py-2.5 text-left text-xs font-semibold text-muted">이름</th>
                <th className="whitespace-nowrap px-5 py-2.5 text-left text-xs font-semibold text-muted">연락처</th>
                <th className="whitespace-nowrap px-5 py-2.5 text-left text-xs font-semibold text-muted">공간유형</th>
                <th className="whitespace-nowrap px-5 py-2.5 text-left text-xs font-semibold text-muted">상태</th>
                <th className="whitespace-nowrap px-5 py-2.5 text-left text-xs font-semibold text-muted">담당자</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentConsultations.map((c) => (
                <tr key={c.consultation_id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/consultations/${c.consultation_id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-muted">{c.phone}</td>
                  <td className="px-5 py-3 text-muted">
                    {SPACE_TYPE_LABELS[c.space_type] || c.space_type}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3 text-muted">{c.admin_name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-muted">
            아직 상담 신청이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

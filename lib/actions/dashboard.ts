'use server'

import { query } from '@/lib/db'
import type { Consultation } from '@/lib/types'

interface DashboardStats {
  totalConsultations: number
  pendingCount: number
  contactedCount: number
  contractedCount: number
  totalPortfolios: number
  totalCustomers: number
  recentConsultations: Consultation[]
  monthlyStats: { month: string; total: number; contracted: number }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [counts] = await query<[{
    total: number
    pending: number
    contacted: number
    contracted: number
  }]>(
    `SELECT
       COUNT(*) as total,
       SUM(status = 'pending') as pending,
       SUM(status = 'contacted') as contacted,
       SUM(status = 'contracted') as contracted
     FROM TA_CONSULTATION_INFO`
  )

  const [portfolioCount] = await query<[{ cnt: number }]>(
    'SELECT COUNT(*) as cnt FROM TA_PORTFOLIO_INFO'
  )

  const [customerCount] = await query<[{ cnt: number }]>(
    'SELECT COUNT(*) as cnt FROM TA_CUSTOMER_INFO'
  )

  const recentConsultations = await query<Consultation[]>(
    `SELECT c.*, a.name AS admin_name
     FROM TA_CONSULTATION_INFO c
     LEFT JOIN TA_ADMIN_INFO a ON a.admin_id = c.assigned_admin_id
     ORDER BY
       CASE c.status WHEN 'pending' THEN 0 ELSE 1 END,
       c.created_at DESC
     LIMIT 5`
  )

  const monthlyStats = await query<{ month: string; total: number; contracted: number }[]>(
    `SELECT
       DATE_FORMAT(created_at, '%Y-%m') AS month,
       COUNT(*) AS total,
       SUM(status = 'contracted') AS contracted
     FROM TA_CONSULTATION_INFO
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
     GROUP BY DATE_FORMAT(created_at, '%Y-%m')
     ORDER BY month DESC`
  )

  return {
    totalConsultations: counts?.total || 0,
    pendingCount: counts?.pending || 0,
    contactedCount: counts?.contacted || 0,
    contractedCount: counts?.contracted || 0,
    totalPortfolios: portfolioCount?.cnt || 0,
    totalCustomers: customerCount?.cnt || 0,
    recentConsultations,
    monthlyStats,
  }
}

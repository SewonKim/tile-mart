import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DB_HOST: process.env.DB_HOST ? '설정됨' : '미설정',
      DB_PORT: process.env.DB_PORT || '미설정',
      DB_USER: process.env.DB_USER ? '설정됨' : '미설정',
      DB_PASSWORD: process.env.DB_PASSWORD ? `설정됨 (${process.env.DB_PASSWORD.length}자)` : '미설정',
      DB_NAME: process.env.DB_NAME || '미설정',
      JWT_SECRET: process.env.JWT_SECRET ? '설정됨' : '미설정',
    },
  }

  try {
    const { query } = await import('@/lib/db')
    const rows = await query<[{ result: number }]>('SELECT 1 AS result')
    checks.db = { status: 'OK', result: rows }
  } catch (e) {
    checks.db = {
      status: 'FAILED',
      error: e instanceof Error ? e.message : String(e),
    }
  }

  return NextResponse.json(checks)
}

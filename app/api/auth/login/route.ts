import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/db'
import { createSession, COOKIE_NAME } from '@/lib/auth'
import type { Admin } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const admin = await queryOne<Admin>(
      'SELECT * FROM TA_ADMIN_INFO WHERE email = ? AND is_active = 1',
      [email]
    )

    if (!admin) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, admin.password_hash!)
    if (!isValid) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    const token = await createSession({
      adminId: admin.admin_id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    })

    await queryOne(
      'UPDATE TA_ADMIN_INFO SET last_login_at = NOW() WHERE admin_id = ?',
      [admin.admin_id]
    )

    const response = NextResponse.json({
      success: true,
      admin: {
        admin_id: admin.admin_id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

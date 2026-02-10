import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { uploadToS3, generateUploadKey } from '@/lib/s3'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  // 인증 확인
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'JPG, PNG, WebP, GIF 이미지만 업로드 가능합니다.' },
        { status: 400 }
      )
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      )
    }

    // S3 업로드
    const buffer = Buffer.from(await file.arrayBuffer())
    const key = generateUploadKey(folder, file.name)
    const url = await uploadToS3(buffer, key, file.type)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '업로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}

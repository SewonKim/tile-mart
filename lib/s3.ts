import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET = process.env.AWS_S3_BUCKET || 'tilemart-images'
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || ''

/**
 * S3에 파일 업로드
 * @returns CDN URL (CloudFront) 또는 S3 직접 URL
 */
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )

  if (CDN_URL) {
    return `${CDN_URL}/${key}`
  }

  return `https://${BUCKET}.s3.${process.env.AWS_S3_REGION || 'ap-northeast-2'}.amazonaws.com/${key}`
}

/**
 * S3에서 파일 삭제
 */
export async function deleteFromS3(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )
}

/**
 * URL에서 S3 키 추출
 */
export function getS3KeyFromUrl(url: string): string | null {
  if (!url) return null

  // CDN URL에서 키 추출
  if (CDN_URL && url.startsWith(CDN_URL)) {
    return url.replace(`${CDN_URL}/`, '')
  }

  // S3 URL에서 키 추출
  const s3Match = url.match(/\.s3\.[^/]+\.amazonaws\.com\/(.+)$/)
  if (s3Match) return s3Match[1]

  return null
}

/**
 * 업로드 키 생성
 * 형식: images/{folder}/{timestamp}-{random}.{ext}
 */
export function generateUploadKey(folder: string, fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `images/${folder}/${timestamp}-${random}.${ext}`
}

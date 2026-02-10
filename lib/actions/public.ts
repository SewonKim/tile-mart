'use server'

import { query, queryOne } from '@/lib/db'
import type { Service, ServiceFeature, Portfolio, PortfolioImage, Tag } from '@/lib/types'

// ========================================
// 히어로 슬라이더 - Featured 시공사례
// ========================================
export async function getFeaturedPortfolios() {
  return query<Array<{
    portfolio_id: number
    title: string
    location: string
    area: string
    cost: string
    thumbnail_url: string | null
    service_title: string | null
    service_tagline: string | null
  }>>(
    `SELECT p.portfolio_id, p.title, p.location, p.area, p.cost, p.thumbnail_url,
            s.title AS service_title, s.tagline AS service_tagline
     FROM TA_PORTFOLIO_INFO p
     LEFT JOIN TA_SERVICE_INFO s ON s.service_id = p.service_id
     WHERE p.is_featured = 1 AND p.is_active = 1
     ORDER BY p.completed_at DESC
     LIMIT 6`
  )
}

// ========================================
// 포트폴리오 목록 (랜딩 페이지)
// ========================================
export async function getPublicPortfolios() {
  return query<Array<Portfolio & { service_name: string | null }>>(
    `SELECT p.*, s.title AS service_name
     FROM TA_PORTFOLIO_INFO p
     LEFT JOIN TA_SERVICE_INFO s ON s.service_id = p.service_id
     WHERE p.is_active = 1
     ORDER BY p.completed_at DESC`
  )
}

// ========================================
// 포트폴리오 상세 (ID 기반)
// ========================================
export async function getPublicPortfolioById(id: number) {
  const portfolio = await queryOne<Portfolio & { service_name: string | null }>(
    `SELECT p.*, s.title AS service_name
     FROM TA_PORTFOLIO_INFO p
     LEFT JOIN TA_SERVICE_INFO s ON s.service_id = p.service_id
     WHERE p.portfolio_id = ? AND p.is_active = 1`,
    [id]
  )

  if (!portfolio) return null

  const images = await query<PortfolioImage[]>(
    `SELECT * FROM TA_PORTFOLIO_IMAGE_INFO
     WHERE portfolio_id = ?
     ORDER BY sort_order`,
    [id]
  )

  const tags = await query<Tag[]>(
    `SELECT t.*
     FROM TA_TAG_INFO t
     JOIN TA_PORTFOLIO_TAG_INFO pt ON pt.tag_id = t.tag_id
     WHERE pt.portfolio_id = ?`,
    [id]
  )

  return { portfolio, images, tags }
}

// ========================================
// 이전/다음 포트폴리오
// ========================================
export async function getAdjacentPortfolios(currentId: number) {
  const prev = await queryOne<{ portfolio_id: number; title: string }>(
    `SELECT portfolio_id, title FROM TA_PORTFOLIO_INFO
     WHERE portfolio_id < ? AND is_active = 1
     ORDER BY portfolio_id DESC LIMIT 1`,
    [currentId]
  )

  const next = await queryOne<{ portfolio_id: number; title: string }>(
    `SELECT portfolio_id, title FROM TA_PORTFOLIO_INFO
     WHERE portfolio_id > ? AND is_active = 1
     ORDER BY portfolio_id ASC LIMIT 1`,
    [currentId]
  )

  return { prev, next }
}

// ========================================
// 서비스 목록
// ========================================
export async function getPublicServices() {
  return query<Service[]>(
    `SELECT * FROM TA_SERVICE_INFO
     WHERE is_active = 1
     ORDER BY sort_order, service_id`
  )
}

// ========================================
// 서비스 상세 (slug 기반)
// ========================================
export async function getPublicServiceBySlug(slug: string) {
  const service = await queryOne<Service>(
    `SELECT * FROM TA_SERVICE_INFO
     WHERE slug = ? AND is_active = 1`,
    [slug]
  )

  if (!service) return null

  const features = await query<ServiceFeature[]>(
    `SELECT * FROM TA_SERVICE_FEATURE_INFO
     WHERE service_id = ?
     ORDER BY sort_order`,
    [service.service_id]
  )

  return { service, features }
}

// ========================================
// 관련 시공사례 (서비스별)
// ========================================
export async function getRelatedPortfolios(serviceId: number, limit: number = 3) {
  return query<Portfolio[]>(
    `SELECT p.*, s.title AS service_name
     FROM TA_PORTFOLIO_INFO p
     LEFT JOIN TA_SERVICE_INFO s ON s.service_id = p.service_id
     WHERE p.service_id = ? AND p.is_active = 1
     ORDER BY p.completed_at DESC
     LIMIT ?`,
    [serviceId, limit]
  )
}

// ========================================
// 태그 목록 (카테고리 필터용)
// ========================================
export async function getPublicTags() {
  return query<Tag[]>(
    `SELECT * FROM TA_TAG_INFO ORDER BY tag_id`
  )
}

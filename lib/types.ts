// ==========================================
// 타일마트 CMS 타입 정의
// ==========================================

// --- Admin ---
export interface Admin {
  admin_id: number
  email: string
  password_hash?: string
  name: string
  role: AdminRole
  is_active: number
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export type AdminRole = 'super_admin' | 'admin' | 'editor'

// --- Service ---
export interface Service {
  service_id: number
  slug: string
  title: string
  subtitle: string
  tagline: string
  description: string
  image_url: string | null
  color: string
  sort_order: number
  is_active: number
  created_at: string
  updated_at: string
  features?: ServiceFeature[]
}

export interface ServiceFeature {
  feature_id: number
  service_id: number
  content: string
  sort_order: number
}

// --- Portfolio ---
export interface Portfolio {
  portfolio_id: number
  service_id: number | null
  title: string
  slug: string
  description: string
  location: string
  area: string
  cost: string
  duration: string | null
  thumbnail_url: string | null
  is_featured: number
  is_active: number
  completed_at: string | null
  created_at: string
  updated_at: string
  images?: PortfolioImage[]
  tags?: Tag[]
  service_name?: string
}

export interface PortfolioImage {
  image_id: number
  portfolio_id: number
  image_url: string
  alt_text: string | null
  sort_order: number
  created_at: string
}

// --- Tag ---
export interface Tag {
  tag_id: number
  name: string
  slug: string
}

// --- Customer ---
export interface Customer {
  customer_id: number
  name: string
  phone: string
  email: string | null
  memo: string | null
  created_at: string
  updated_at: string
  consultation_count?: number
}

// --- Consultation ---
export type SpaceType = 'office' | 'academy' | 'fitness' | 'residential' | 'renovation' | 'retail' | 'fnb' | 'other'
export type ConsultationStatus = 'pending' | 'contacted' | 'visiting' | 'quoted' | 'contracted' | 'cancelled'
export type ConsultationSource = 'website' | 'phone' | 'kakao' | 'walk_in' | 'referral'
export type LogAction = 'created' | 'status_changed' | 'note_added' | 'assigned' | 'called' | 'visited'

export interface Consultation {
  consultation_id: number
  customer_id: number | null
  name: string
  phone: string
  space_type: SpaceType
  area: string | null
  message: string | null
  status: ConsultationStatus
  assigned_admin_id: number | null
  source: ConsultationSource
  created_at: string
  updated_at: string
  admin_name?: string
}

export interface ConsultationLog {
  log_id: number
  consultation_id: number
  admin_id: number | null
  action: LogAction
  prev_status: string | null
  new_status: string | null
  note: string | null
  created_at: string
  admin_name?: string
}

// --- Site Settings ---
export interface SiteSetting {
  setting_key: string
  setting_value: string
  description: string | null
  updated_at: string
}

// --- Pagination ---
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// --- Session ---
export interface SessionPayload {
  adminId: number
  email: string
  name: string
  role: AdminRole
}

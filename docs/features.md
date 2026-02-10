# 타일마트 CMS - 기능 정의서

> 마지막 업데이트: 2026-02-10

## 목차

1. [시스템 개요](#시스템-개요)
2. [공개 페이지](#공개-페이지)
3. [관리자 패널](#관리자-패널)
4. [API 엔드포인트](#api-엔드포인트)
5. [서버 액션](#서버-액션)
6. [인증 및 보안](#인증-및-보안)
7. [이미지 업로드 시스템](#이미지-업로드-시스템)
8. [데이터베이스 스키마](#데이터베이스-스키마)
9. [타입 정의](#타입-정의)
10. [유효성 검증](#유효성-검증)
11. [상수 정의](#상수-정의)

---

## 시스템 개요

**타일마트(TileMart)**는 타일 인테리어 전문 시공업체를 위한 CMS(콘텐츠 관리 시스템)입니다.

### 주요 기능
- 공개 랜딩 페이지 (포트폴리오, 서비스 소개, 상담 신청)
- 관리자 대시보드 (상담/포트폴리오/서비스/고객/태그/설정 관리)
- 상담 신청 관리 (상태 추적, 담당자 배정, 진행 기록)
- 이미지 업로드 (AWS S3 + CloudFront CDN)
- JWT 기반 관리자 인증

### 기술 스택
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js Server Actions + API Routes
- **Database:** MySQL (AWS Lightsail, InnoDB, utf8mb4)
- **Image Storage:** AWS S3 + CloudFront CDN
- **Authentication:** JWT (jose) + HTTP-only Cookie
- **Deployment:** AWS Amplify

### 파일 구조
```
app/
├── page.tsx                        # 랜딩 페이지 (서버 컴포넌트)
├── not-found.tsx                   # 404 페이지
├── error.tsx                       # 500 에러 페이지
├── logo-preview/page.tsx           # 로고 프리뷰
├── portfolio/[id]/                 # 시공사례 상세
├── services/[slug]/                # 서비스 상세
├── admin/
│   ├── (auth)/login/               # 로그인
│   └── (dashboard)/                # 관리자 대시보드
│       ├── page.tsx                # 대시보드 홈
│       ├── consultations/          # 상담 관리
│       ├── portfolios/             # 포트폴리오 관리
│       ├── services/               # 서비스 관리
│       ├── tags/                   # 태그 관리
│       ├── customers/              # 고객 관리
│       ├── users/                  # 사용자 관리
│       └── settings/               # 사이트 설정
└── api/
    ├── auth/                       # 인증 API
    └── upload/                     # 이미지 업로드 API

components/
├── landing/                        # 랜딩 페이지 컴포넌트
│   ├── Header.tsx
│   ├── HeroSlider.tsx
│   ├── Portfolio.tsx
│   ├── Services.tsx
│   ├── Consultation.tsx
│   └── Footer.tsx
└── admin/
    ├── layout/                     # 사이드바, 헤더
    ├── forms/                      # PortfolioForm, ServiceForm
    └── ui/                         # DataTable, Pagination, Modal 등

lib/
├── db.ts                           # DB 연결
├── auth.ts                         # JWT 인증
├── s3.ts                           # S3 업로드/삭제
├── types.ts                        # 타입 정의
├── validators.ts                   # 유효성 검증
├── constants.ts                    # 상수 (라벨, 색상 등)
└── actions/                        # Server Actions
    ├── public.ts                   # 공개 페이지 데이터 조회
    ├── consultations.ts            # 상담 CRUD
    ├── portfolios.ts               # 포트폴리오 CRUD
    ├── services.ts                 # 서비스 CRUD
    ├── tags.ts                     # 태그 CRUD
    ├── customers.ts                # 고객 CRUD
    ├── users.ts                    # 사용자 관리
    ├── settings.ts                 # 사이트 설정
    └── dashboard.ts                # 대시보드 통계
```

---

## 공개 페이지

### 1. 홈페이지 (`/`)

**파일:** `app/page.tsx` (서버 컴포넌트)

**데이터 소스:**
- `getFeaturedPortfolios()` — 메인 슬라이더용 Featured 포트폴리오 (최대 6개)
- `getPublicPortfolios()` — 전체 활성 포트폴리오
- `getPublicServices()` — 전체 활성 서비스
- `getPublicTags()` — 필터용 태그 목록

**섹션 구성:**

#### A. Header
- 로고 + 네비게이션 메뉴 + 연락처

#### B. Hero Slider (`HeroSlider.tsx`)
- Featured 포트폴리오 6개를 슬라이드로 표시
- 각 슬라이드: 썸네일 이미지, 프로젝트 제목, 서비스 태그라인, 위치/면적/시공비
- 자동 회전 (3초 간격), 좌/우 네비게이션, 닷 인디케이터

#### C. 시공사례 (`Portfolio.tsx`)
- 태그 기반 필터 버튼 ("전체" + 태그명)
- 포트폴리오 카드 그리드 (sm: 2열, md: 3열, lg: 4열)
- 각 카드: 썸네일, 프로젝트명, 서비스 카테고리, 위치/면적/시공비
- 클릭 시 상세 페이지 (`/portfolio/[id]`)

#### D. 하는 일 (`Services.tsx`)
- 서비스 카테고리 카드 그리드
- 각 카드: 색상 배경, 아이콘, 서비스명, 영문 표기, 한줄 소개
- 클릭 시 서비스 상세 페이지 (`/services/[slug]`)
- 아이콘 매핑: slug → Lucide 아이콘 (클라이언트에서 관리)

#### E. 상담 신청 (`Consultation.tsx`)
- 좌측: 연락처 정보 + 상담 안내
- 우측: 상담 신청 폼
  - 이름 (필수)
  - 전화번호 (필수)
  - 공간 유형 (select, 필수)
  - 예상 면적 (선택)
  - 추가 메시지 (textarea, 선택)
- 제출 → `createConsultation()` 서버 액션 → DB 저장
- 성공/실패 결과 메시지 표시

#### F. Footer
- 회사정보, 연락처, SNS 링크

---

### 2. 시공사례 상세 (`/portfolio/[id]`)

**파일:** `app/portfolio/[id]/page.tsx`

**데이터 소스:**
- `getPublicPortfolioById(id)` — 포트폴리오 정보 + 이미지 + 태그
- `getAdjacentPortfolios(id)` — 이전/다음 포트폴리오

**UI 구성:**
- 상단: "시공사례 목록" 링크, 서비스 태그 배지
- 히어로 이미지 (첫 번째 이미지 또는 썸네일, 그래디언트 오버레이)
- 2열 그리드:
  - **좌측 (2/3):** 설명, 시공 사진 갤러리 (라이트박스 뷰어)
  - **우측 (1/3):** 고정 정보 카드 (위치, 면적, 시공비, 기간, 태그, CTA 버튼)
- 하단: 이전/다음 프로젝트 네비게이션

**메타데이터:** `{portfolio.title} | 타일마트 시공사례`

---

### 3. 서비스 상세 (`/services/[slug]`)

**파일:** `app/services/[slug]/page.tsx`

**데이터 소스:**
- `getPublicServiceBySlug(slug)` — 서비스 정보 + 특징
- `getRelatedPortfolios(serviceId, 3)` — 관련 포트폴리오 3개
- `getPublicServices()` — 다른 서비스 목록

**UI 구성:**
- 히어로: 배경 이미지 + 그래디언트, 영문 배지, 제목, 태그라인
- 설명 섹션: 서비스 상세 설명
- 특징 리스트: 2열 그리드, 체크 아이콘 + 특징 내용
- 시공 갤러리: 관련 포트폴리오 이미지 3개
- 관련 시공사례: 카드 3개
- CTA: 무료 상담 신청 + 전화 상담 버튼
- 다른 서비스: 현재 서비스 제외 나머지 서비스 목록

---

### 4. 404 페이지 (`/not-found`)

**파일:** `app/not-found.tsx` (서버 컴포넌트)

- "404" + "페이지를 찾을 수 없습니다"
- "홈으로 이동" 링크

### 5. 에러 페이지

**파일:** `app/error.tsx` (클라이언트 컴포넌트)

- "500" + "서버 오류가 발생했습니다"
- "다시 시도" 버튼 (`reset()`) + "홈으로 이동" 링크

### 6. 로고 프리뷰 (`/logo-preview`)

**파일:** `app/logo-preview/page.tsx`

- 3가지 로고 컨셉 표시 (타일 그리드, T 레터마크, 다이아몬드 타일)
- 라이트/다크 배경에서 각각 표시

---

## 관리자 패널

### 접근 제어
- 모든 `/admin/*` 경로는 인증 필수 (미들웨어)
- `/admin/users`는 `super_admin` 역할만 접근 가능
- 유효하지 않은 토큰 시 `/admin/login`으로 리다이렉트

### 레이아웃
- **AdminSidebar:** 좌측 사이드바 네비게이션
- **AdminHeader:** 상단 헤더 (사용자 정보, 로그아웃)
- **ToastProvider:** 알림 토스트

---

### 1. 로그인 (`/admin/login`)

**기능:**
- 이메일 + 비밀번호 입력
- `POST /api/auth/login` 호출
- 성공 시 `/admin` 리다이렉트
- 실패 시 에러 메시지 표시

**에러 메시지:**
- "이메일 또는 비밀번호가 올바르지 않습니다."
- "이메일과 비밀번호를 입력해주세요."

---

### 2. 대시보드 (`/admin`)

**데이터:** `getDashboardStats()`

**통계 카드 (6개):**
| 카드 | 아이콘 | 색상 |
|------|--------|------|
| 전체 상담 | MessageSquare | 기본 |
| 대기중 | Clock | 황색 |
| 연락완료 | Phone | 파란색 |
| 계약완료 | CheckCircle | 초록색 |
| 시공사례 | Briefcase | 기본 |
| 고객수 | Users | 기본 |

**최근 상담 테이블:**
- 상위 5개, pending 우선 정렬
- 컬럼: 이름, 연락처, 공간유형, 상태, 담당자
- 행 클릭 → 상담 상세 페이지

---

### 3. 상담 관리 (`/admin/consultations`)

**기능:**
- 상담 목록 (페이지네이션 20개씩)
- 상태별 필터 탭 (전체, pending, contacted, visiting, quoted, contracted, cancelled)
- 이름/전화번호 검색

**테이블 컬럼:** 이름, 연락처, 공간유형, 면적, 상태(배지), 유입경로, 담당자, 신청일

---

### 4. 상담 상세 (`/admin/consultations/[id]`)

**데이터:** `getConsultation(id)`, `getAdminsList()`

**좌측:**
- 기본 정보 (이름, 전화, 공간유형, 면적, 유입경로, 신청일시)
- 상태 변경 (드롭다운 + 변경 버튼)
- 담당자 배정 (드롭다운 + 배정 버튼)
- 삭제 버튼

**우측:**
- 메모 추가 (텍스트 + 추가 버튼)
- 히스토리 타임라인 (액션타입, 실행자, 타임스탬프, 상세)

**상태 흐름:**
```
pending → contacted → visiting → quoted → contracted
                                            ↓
                                        cancelled
```

---

### 5. 포트폴리오 관리 (`/admin/portfolios`)

**기능:** 목록 조회, 검색, Featured 토글, 활성 토글, 삭제

**테이블 컬럼:** 썸네일, 제목, 서비스, 위치, 면적, 시공비, Featured(별), 활성(체크), 액션

---

### 6. 포트폴리오 등록/수정 (`/admin/portfolios/new`, `/admin/portfolios/[id]/edit`)

**폼 필드:**

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| 제목 | text | O | 입력 시 slug 자동 생성 (등록 시만) |
| 슬러그 | text | O | 영문 소문자, 숫자, 하이픈 |
| 서비스 카테고리 | select | X | 서비스 목록에서 선택 |
| 설명 | textarea | O | |
| 위치 | text | O | 예: "서울 강남구" |
| 면적 | text | O | 예: "52평" |
| 시공비 | text | O | 예: "4,200만원" |
| 시공기간 | text | X | 예: "4주" |
| 시공완료일 | date | X | |
| 대표 이미지 | ImageUpload | X | S3 업로드, 드래그앤드롭 |
| 갤러리 이미지 | MultiImageUpload | X | 다중 이미지, 순서 표시 |
| 태그 | 체크박스 | X | 다중 선택 |
| 메인 추천 | checkbox | X | Featured 여부 |
| 공개 | checkbox | X | 기본값: 활성 |

**제출:** `createPortfolio()` / `updatePortfolio()` → 성공 시 목록 페이지 리다이렉트

---

### 7. 서비스 관리 (`/admin/services`)

**기능:** 목록 조회, 활성 토글, 정렬 순서, 삭제

**테이블 컬럼:** 색상, 서비스명, 영문 표기, 한줄 소개, 특징 수, 포트폴리오 수, 활성, 액션

---

### 8. 서비스 등록/수정 (`/admin/services/new`, `/admin/services/[id]/edit`)

**폼 필드:**

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| 서비스명 | text | O | 입력 시 slug 자동 생성 (등록 시만) |
| 슬러그 | text | O | |
| 영문 표기 | text | O | 예: "OFFICE" |
| 한줄 소개 | text | O | |
| 설명 | textarea | O | |
| 서비스 이미지 | ImageUpload | X | S3 업로드 |
| 브랜드 컬러 | color picker | X | HEX, 기본값: #55c89f |
| 정렬 순서 | number | X | |
| 서비스 특징 | 동적 리스트 | X | 항목 추가/제거 |
| 공개 | checkbox | X | |

---

### 9. 태그 관리 (`/admin/tags`)

**기능:** 목록 조회, 생성(모달), 수정(모달), 삭제

**테이블 컬럼:** 태그명, 슬러그, 사용 중 포트폴리오 수, 액션

**모달 폼:** 태그명(필수), 슬러그(필수, 자동 생성 가능)

---

### 10. 고객 관리 (`/admin/customers`)

**기능:** 목록 조회 (페이지네이션), 검색(이름/전화/이메일), 생성/수정(모달), 삭제

**테이블 컬럼:** 이름, 전화번호, 이메일, 상담 이력 수, 등록일, 액션

**모달 폼:** 이름(필수), 전화번호(필수), 이메일(선택), 메모(선택)

---

### 11. 사용자 관리 (`/admin/users`) — super_admin 전용

**기능:** 관리자 목록, 역할 변경, 활성/비활성 설정, 생성, 삭제

**테이블 컬럼:** 이메일, 이름, 역할, 활성 여부, 마지막 로그인, 액션

**역할:**
| 역할 | 설명 |
|------|------|
| super_admin | 모든 기능 + 사용자 관리 |
| admin | 상담, 포트폴리오, 서비스, 고객, 태그, 설정 관리 |
| editor | 포트폴리오, 서비스 수정만 가능 |

---

### 12. 사이트 설정 (`/admin/settings`)

**설정 항목:**
| 키 | 설명 | 예시 |
|----|------|------|
| company_name | 회사명 | 타일마트 |
| phone | 대표 전화 | 0507-1497-0485 |
| address | 주소 | 경기 고양시 일산서구 경의로 826 |
| business_hours | 영업시간 | 매일 08:00 - 18:30 |
| instagram_url | 인스타그램 URL | |
| youtube_url | 유튜브 URL | |
| kakao_url | 카카오톡 상담 URL | |

---

## API 엔드포인트

### POST `/api/auth/login`

**요청:**
```json
{ "email": "admin@tilemart.co.kr", "password": "password123" }
```

**성공 응답 (200):**
```json
{
  "success": true,
  "admin": { "admin_id": 1, "email": "...", "name": "관리자", "role": "super_admin" }
}
```
- 쿠키 설정: `admin_session` (httpOnly, secure, SameSite=lax, maxAge=86400)

**실패 응답 (401):**
```json
{ "error": "이메일 또는 비밀번호가 올바르지 않습니다." }
```

**처리 흐름:**
1. 이메일로 관리자 조회 → is_active 확인 → bcryptjs 비밀번호 비교
2. JWT 토큰 생성 (24시간 유효) → 쿠키 저장 → last_login_at 업데이트

---

### POST `/api/auth/logout`

**응답:** `{ "success": true }` + admin_session 쿠키 삭제

---

### GET `/api/auth/me`

**성공 (200):**
```json
{ "session": { "adminId": 1, "email": "...", "name": "관리자", "role": "super_admin" } }
```

**실패 (401):** `{ "session": null }`

---

### POST `/api/upload`

**인증:** 필수 (JWT)

**요청:** `multipart/form-data` — `file` (이미지) + `folder` (portfolios | services | general)

**검증:**
- 파일 타입: image/jpeg, image/png, image/webp, image/gif
- 파일 크기: 최대 5MB

**성공 (200):**
```json
{ "url": "https://cdn.tilemart.co.kr/images/portfolios/1707891234567-abc123.jpg" }
```

**실패:** 401 (미인증), 400 (파일 없음/타입/크기), 500 (업로드 오류)

---

## 서버 액션

### 공개 액션 (`lib/actions/public.ts`)

| 함수 | 설명 | 반환 |
|------|------|------|
| `getFeaturedPortfolios()` | 메인 슬라이더용 (is_featured=1, is_active=1, 최대 6개) | Portfolio[] (service 정보 포함) |
| `getPublicPortfolios()` | 전체 활성 포트폴리오 | Portfolio[] |
| `getPublicPortfolioById(id)` | 포트폴리오 상세 (이미지, 태그 포함) | { portfolio, images, tags } |
| `getAdjacentPortfolios(id)` | 이전/다음 포트폴리오 | { prev, next } |
| `getPublicServices()` | 전체 활성 서비스 (sort_order 순) | Service[] |
| `getPublicServiceBySlug(slug)` | 서비스 상세 (특징 포함) | { service, features } |
| `getRelatedPortfolios(serviceId, limit)` | 서비스 관련 포트폴리오 | Portfolio[] |
| `getPublicTags()` | 전체 태그 | Tag[] |

### 상담 액션 (`lib/actions/consultations.ts`)

| 함수 | 설명 |
|------|------|
| `getConsultations({ page, status, search, assignedTo })` | 목록 (페이지네이션, 필터, 검색) |
| `getConsultation(id)` | 상세 + 로그 |
| `createConsultation(data)` | 상담 생성 + 'created' 로그 |
| `updateConsultationStatus(id, newStatus)` | 상태 변경 + 'status_changed' 로그 |
| `addConsultationNote(id, note)` | 메모 추가 + 'note_added' 로그 |
| `assignConsultation(id, adminId)` | 담당자 배정 + 'assigned' 로그 |
| `deleteConsultation(id)` | 상담 삭제 |
| `getAdminsList()` | 담당자 선택용 관리자 목록 |

### 포트폴리오 액션 (`lib/actions/portfolios.ts`)

| 함수 | 설명 |
|------|------|
| `getPortfolios({ page, search, serviceId })` | 목록 (페이지네이션, 검색) |
| `getPortfolio(id)` | 상세 (이미지, 태그 포함) |
| `createPortfolio(data)` | 생성 (이미지 + 태그 트랜잭션) |
| `updatePortfolio(id, data)` | 수정 (이미지/태그 삭제 후 재삽입) |
| `deletePortfolio(id)` | 삭제 (CASCADE) |
| `togglePortfolioFeatured(id, featured)` | Featured 토글 |
| `togglePortfolioActive(id, active)` | 활성 토글 |

### 서비스 액션 (`lib/actions/services.ts`)

| 함수 | 설명 |
|------|------|
| `getServicesList()` | 전체 서비스 목록 |
| `getService(id)` | 상세 (특징 포함) |
| `createService(data)` | 생성 (특징 포함, 트랜잭션) |
| `updateService(id, data)` | 수정 (특징 재삽입) |
| `deleteService(id)` | 삭제 |
| `toggleServiceActive(id, active)` | 활성 토글 |

### 기타 액션

| 파일 | 주요 함수 |
|------|-----------|
| `tags.ts` | `getTags()`, `createTag()`, `updateTag()`, `deleteTag()` |
| `customers.ts` | `getCustomers()`, `getCustomer()`, `createCustomer()`, `updateCustomer()` |
| `users.ts` | 관리자 CRUD (super_admin 전용) |
| `settings.ts` | 사이트 설정 조회/수정 |
| `dashboard.ts` | `getDashboardStats()` — 통계 카드 + 최근 상담 + 월별 통계 |

---

## 인증 및 보안

### JWT 토큰 (`lib/auth.ts`)

| 항목 | 값 |
|------|-----|
| 라이브러리 | jose |
| 알고리즘 | HS256 |
| 만료 시간 | 24시간 |
| 서명 키 | `process.env.JWT_SECRET` |

**페이로드:**
```typescript
{ adminId: number, email: string, name: string, role: AdminRole }
```

### 쿠키 설정

| 속성 | 값 |
|------|-----|
| 쿠키명 | `admin_session` |
| httpOnly | true |
| secure | production에서만 |
| sameSite | lax |
| maxAge | 86400 (24시간) |
| path | / |

### 미들웨어 (`middleware.ts`)

- `/admin/login` — 이미 로그인 상태면 `/admin`으로 리다이렉트
- `/admin/*` — 토큰 없거나 만료 시 `/admin/login`으로 리다이렉트
- `/admin/users` — `super_admin` 역할이 아니면 접근 차단

---

## 이미지 업로드 시스템

### 아키텍처
```
[관리자] → [POST /api/upload] → [AWS S3 버킷] → [CloudFront CDN] → [프론트 Image]
```

### S3 유틸리티 (`lib/s3.ts`)

| 함수 | 설명 |
|------|------|
| `uploadToS3(file, key, contentType)` | S3 PutObject (CacheControl: 1년) → CDN URL 반환 |
| `deleteFromS3(key)` | S3 DeleteObject |
| `generateUploadKey(folder, fileName)` | 키 생성: `images/{folder}/{timestamp}-{random}.{ext}` |
| `getS3KeyFromUrl(url)` | URL에서 S3 키 추출 (삭제용) |

### 환경변수
```
AWS_S3_BUCKET=tilemart-images
AWS_S3_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
NEXT_PUBLIC_CDN_URL=https://dXXXXXXX.cloudfront.net
```

### ImageUpload 컴포넌트 (단일 이미지)

**Props:** `value`, `onChange(url)`, `folder`, `label`

**기능:** 드래그앤드롭 + 클릭 선택, 이미지 미리보기, 삭제 버튼, 에러 메시지

**사용처:** PortfolioForm (대표 이미지), ServiceForm (서비스 이미지)

### MultiImageUpload 컴포넌트 (다중 이미지)

**Props:** `images[]`, `onChange(images)`, `folder`, `label`

**기능:** 그리드 표시 (2~4열), 순서 번호, 개별 삭제, 추가 버튼

**사용처:** PortfolioForm (갤러리 이미지)

### 업로드 제한
- 파일 타입: JPEG, PNG, WebP, GIF
- 파일 크기: 최대 5MB

---

## 데이터베이스 스키마

### 테이블 목록

| 테이블 | 설명 | 주요 인덱스 |
|--------|------|------------|
| `TA_ADMIN_INFO` | 관리자 계정 | email (UNIQUE) |
| `TA_SERVICE_INFO` | 서비스 카테고리 | slug (UNIQUE) |
| `TA_SERVICE_FEATURE_INFO` | 서비스 특징 | FK: service_id |
| `TA_PORTFOLIO_INFO` | 시공사례 | slug (UNIQUE), idx_featured_active, idx_service |
| `TA_PORTFOLIO_IMAGE_INFO` | 시공사례 이미지 | FK: portfolio_id (CASCADE) |
| `TA_TAG_INFO` | 태그 | slug (UNIQUE) |
| `TA_PORTFOLIO_TAG_INFO` | 포트폴리오-태그 매핑 | PK: (portfolio_id, tag_id) |
| `TA_CUSTOMER_INFO` | 고객 | idx_phone, idx_name |
| `TA_CONSULTATION_INFO` | 상담 신청 | idx_status, idx_assigned, idx_created |
| `TA_CONSULTATION_LOG_INFO` | 상담 진행 기록 | FK: consultation_id (CASCADE) |
| `TA_SITE_SETTING_INFO` | 사이트 설정 | PK: setting_key |

### 상담 상태 흐름

```
pending (대기중)
  → contacted (연락완료)
    → visiting (방문예정)
      → quoted (견적전달)
        → contracted (계약완료)

어느 단계에서든 → cancelled (취소)
```

### 상담 로그 액션 타입

| 액션 | 설명 |
|------|------|
| created | 상담 신청 생성 |
| status_changed | 상태 변경 (prev_status → new_status) |
| note_added | 메모 추가 |
| assigned | 담당자 배정 |
| called | 전화 연락 |
| visited | 현장 방문 |

### 공간 유형

| 코드 | 한글 |
|------|------|
| office | 사무실 |
| academy | 학원 |
| fitness | 체육시설 |
| residential | 주거공간 |
| renovation | 환경개선 |
| retail | 매장 |
| fnb | 카페/음식점 |
| other | 기타 |

### 유입 경로

| 코드 | 한글 |
|------|------|
| website | 웹사이트 |
| phone | 전화 |
| kakao | 카카오톡 |
| walk_in | 방문 |
| referral | 소개 |

### 시드 데이터
- 서비스 7개 (사무실, 학원, 체육시설, 주거공간, 매장, 카페/음식점, 환경개선)
- 시공사례 8개 (각 서비스별 1~2개)
- 태그 7개 (현대적, 고급스러운, 밝은톤, 심플 등)
- 이미지 24개 (포트폴리오별 2~4개)

---

## 타입 정의

**파일:** `lib/types.ts`

```typescript
// 역할
type AdminRole = 'super_admin' | 'admin' | 'editor'

// 상담
type SpaceType = 'office' | 'academy' | 'fitness' | 'residential' | 'renovation' | 'retail' | 'fnb' | 'other'
type ConsultationStatus = 'pending' | 'contacted' | 'visiting' | 'quoted' | 'contracted' | 'cancelled'
type ConsultationSource = 'website' | 'phone' | 'kakao' | 'walk_in' | 'referral'
type LogAction = 'created' | 'status_changed' | 'note_added' | 'assigned' | 'called' | 'visited'

// 주요 인터페이스
interface Admin { admin_id, email, name, role, is_active, last_login_at, ... }
interface Service { service_id, slug, title, subtitle, tagline, description, image_url, color, sort_order, is_active, ... }
interface ServiceFeature { feature_id, service_id, content, sort_order }
interface Portfolio { portfolio_id, service_id, title, slug, description, location, area, cost, duration, thumbnail_url, is_featured, is_active, completed_at, ... }
interface PortfolioImage { image_id, portfolio_id, image_url, alt_text, sort_order, ... }
interface Tag { tag_id, name, slug }
interface Customer { customer_id, name, phone, email, memo, consultation_count?, ... }
interface Consultation { consultation_id, customer_id, name, phone, space_type, area, message, status, assigned_admin_id, source, ... }
interface ConsultationLog { log_id, consultation_id, admin_id, action, prev_status, new_status, note, ... }
interface SessionPayload { adminId, email, name, role }
interface PaginatedResult<T> { data, total, page, pageSize, totalPages }
```

---

## 유효성 검증

**파일:** `lib/validators.ts`

| 함수 | 규칙 | 에러 메시지 |
|------|------|------------|
| `validateRequired(value, fieldName)` | 빈 문자열 체크 | "{fieldName}을(를) 입력해주세요." |
| `validateEmail(value)` | 이메일 형식 | "유효한 이메일을 입력해주세요." |
| `validatePhone(value)` | 숫자 + 하이픈 | "유효한 전화번호를 입력해주세요." |
| `validateSlug(value)` | 영문 소문자, 숫자, 하이픈 | "영문 소문자, 숫자, 하이픈만 사용할 수 있습니다." |
| `validateHexColor(value)` | `#XXXXXX` 형식 | "유효한 HEX 색상을 입력해주세요." |
| `generateSlug(text)` | 텍스트 → slug 변환 | — |

---

## 상수 정의

**파일:** `lib/constants.ts`

```typescript
SPACE_TYPE_LABELS   // 공간 유형 한글 라벨
STATUS_LABELS       // 상담 상태 한글 라벨
STATUS_COLORS       // 상담 상태별 배지 색상 (Tailwind 클래스)
SOURCE_LABELS       // 유입 경로 한글 라벨
LOG_ACTION_LABELS   // 로그 액션 한글 라벨
ROLE_LABELS         // 역할 한글 라벨
PAGE_SIZE = 20      // 페이지당 항목 수
```

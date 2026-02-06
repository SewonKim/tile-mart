# 타일마트 데이터베이스 스키마 설계

> MariaDB (InnoDB) / utf8mb4_unicode_ci
> 테이블 명명규칙: `TA_XXX_INFO` (대문자)

---

## ERD 개요

```
TA_ADMIN_INFO
  │
  ├── TA_PORTFOLIO_INFO ──── TA_PORTFOLIO_IMAGE_INFO
  │       │
  │       └── TA_PORTFOLIO_TAG_INFO ──── TA_TAG_INFO
  │
  ├── TA_SERVICE_INFO ──── TA_SERVICE_FEATURE_INFO
  │
  ├── TA_CONSULTATION_INFO
  │       │
  │       └── TA_CONSULTATION_LOG_INFO
  │
  ├── TA_CUSTOMER_INFO
  │
  └── TA_SITE_SETTING_INFO
```

---

## 테이블 목록

| # | 테이블명 | 설명 |
|---|---------|------|
| 1 | `TA_ADMIN_INFO` | 관리자 계정 |
| 2 | `TA_SERVICE_INFO` | 서비스 카테고리 (사무실, 학원, 체육시설 등) |
| 3 | `TA_SERVICE_FEATURE_INFO` | 서비스별 특징 항목 |
| 4 | `TA_PORTFOLIO_INFO` | 시공사례 |
| 5 | `TA_PORTFOLIO_IMAGE_INFO` | 시공사례 이미지 |
| 6 | `TA_TAG_INFO` | 태그 (필터용) |
| 7 | `TA_PORTFOLIO_TAG_INFO` | 시공사례-태그 매핑 (다대다) |
| 8 | `TA_CUSTOMER_INFO` | 고객 정보 |
| 9 | `TA_CONSULTATION_INFO` | 상담 신청 |
| 10 | `TA_CONSULTATION_LOG_INFO` | 상담 진행 기록 |
| 11 | `TA_SITE_SETTING_INFO` | 사이트 설정 (연락처, 영업시간 등) |

---

## DDL

### 1. TA_ADMIN_INFO — 관리자 계정

```sql
CREATE TABLE TA_ADMIN_INFO (
    admin_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'admin',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. TA_SERVICE_INFO — 서비스 카테고리

```sql
CREATE TABLE TA_SERVICE_INFO (
    service_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(50) NOT NULL COMMENT '영문 표기 (OFFICE, ACADEMY 등)',
    tagline VARCHAR(200) NOT NULL COMMENT '한줄 소개',
    description TEXT NOT NULL,
    image_url VARCHAR(500) NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#55c89f' COMMENT '브랜드 컬러 HEX',
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_slug (slug),
    INDEX idx_sort_active (sort_order, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. TA_SERVICE_FEATURE_INFO — 서비스별 특징

```sql
CREATE TABLE TA_SERVICE_FEATURE_INFO (
    feature_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_id INT UNSIGNED NOT NULL,
    content VARCHAR(200) NOT NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES TA_SERVICE_INFO(service_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_service_sort (service_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. TA_PORTFOLIO_INFO — 시공사례

```sql
CREATE TABLE TA_PORTFOLIO_INFO (
    portfolio_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_id INT UNSIGNED NULL COMMENT '서비스 카테고리 연결',
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL COMMENT '시공 위치',
    area VARCHAR(20) NOT NULL COMMENT '면적 (예: 52평)',
    cost VARCHAR(30) NOT NULL COMMENT '시공비 (예: 4,200만원)',
    duration VARCHAR(20) NULL COMMENT '시공 기간 (예: 4주)',
    thumbnail_url VARCHAR(500) NULL COMMENT '대표 이미지',
    is_featured TINYINT(1) NOT NULL DEFAULT 0 COMMENT '메인 슬라이더 노출',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    completed_at DATE NULL COMMENT '시공 완료일',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_slug (slug),
    FOREIGN KEY (service_id) REFERENCES TA_SERVICE_INFO(service_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_service (service_id),
    INDEX idx_featured_active (is_featured, is_active),
    INDEX idx_completed (completed_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. TA_PORTFOLIO_IMAGE_INFO — 시공사례 이미지

```sql
CREATE TABLE TA_PORTFOLIO_IMAGE_INFO (
    image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    portfolio_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200) NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (portfolio_id) REFERENCES TA_PORTFOLIO_INFO(portfolio_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_portfolio_sort (portfolio_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. TA_TAG_INFO — 태그

```sql
CREATE TABLE TA_TAG_INFO (
    tag_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    UNIQUE KEY uk_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. TA_PORTFOLIO_TAG_INFO — 시공사례-태그 매핑

```sql
CREATE TABLE TA_PORTFOLIO_TAG_INFO (
    portfolio_id INT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (portfolio_id, tag_id),
    FOREIGN KEY (portfolio_id) REFERENCES TA_PORTFOLIO_INFO(portfolio_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES TA_TAG_INFO(tag_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 8. TA_CUSTOMER_INFO — 고객 정보

```sql
CREATE TABLE TA_CUSTOMER_INFO (
    customer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL,
    memo TEXT NULL COMMENT '관리자 메모',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 9. TA_CONSULTATION_INFO — 상담 신청

```sql
CREATE TABLE TA_CONSULTATION_INFO (
    consultation_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NULL COMMENT '기존 고객 연결 (선택)',
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    space_type ENUM(
        'office', 'academy', 'fitness', 'residential',
        'renovation', 'retail', 'fnb', 'other'
    ) NOT NULL DEFAULT 'other',
    area VARCHAR(20) NULL COMMENT '예상 평수',
    message TEXT NULL COMMENT '추가 요청사항',
    status ENUM('pending', 'contacted', 'visiting', 'quoted', 'contracted', 'cancelled')
        NOT NULL DEFAULT 'pending',
    assigned_admin_id INT UNSIGNED NULL COMMENT '담당 관리자',
    source ENUM('website', 'phone', 'kakao', 'walk_in', 'referral')
        NOT NULL DEFAULT 'website',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES TA_CUSTOMER_INFO(customer_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (assigned_admin_id) REFERENCES TA_ADMIN_INFO(admin_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_status (status),
    INDEX idx_created (created_at DESC),
    INDEX idx_assigned (assigned_admin_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 10. TA_CONSULTATION_LOG_INFO — 상담 진행 기록

```sql
CREATE TABLE TA_CONSULTATION_LOG_INFO (
    log_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    consultation_id INT UNSIGNED NOT NULL,
    admin_id INT UNSIGNED NULL,
    action ENUM('created', 'status_changed', 'note_added', 'assigned', 'called', 'visited')
        NOT NULL,
    prev_status VARCHAR(20) NULL,
    new_status VARCHAR(20) NULL,
    note TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consultation_id) REFERENCES TA_CONSULTATION_INFO(consultation_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES TA_ADMIN_INFO(admin_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_consultation (consultation_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 11. TA_SITE_SETTING_INFO — 사이트 설정

```sql
CREATE TABLE TA_SITE_SETTING_INFO (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description VARCHAR(200) NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 초기 데이터
INSERT INTO TA_SITE_SETTING_INFO (setting_key, setting_value, description) VALUES
('company_name', '타일마트', '회사명'),
('phone', '0507-1497-0485', '대표전화'),
('address', '경기 고양시 일산서구 경의로 826 전면상가좌측칸', '주소'),
('business_hours', '매일 08:00 - 18:30', '영업시간'),
('instagram_url', '', '인스타그램 URL'),
('youtube_url', '', '유튜브 URL'),
('kakao_url', '', '카카오톡 상담 URL');
```

---

## 인덱스 전략

| 테이블 | 인덱스 | 용도 |
|--------|--------|------|
| `TA_PORTFOLIO_INFO` | `idx_featured_active` | 메인 슬라이더 조회 |
| `TA_PORTFOLIO_INFO` | `idx_service` | 서비스별 시공사례 필터링 |
| `TA_PORTFOLIO_INFO` | `idx_completed` | 최신 시공사례 정렬 |
| `TA_CONSULTATION_INFO` | `idx_status` | 상태별 상담 목록 |
| `TA_CONSULTATION_INFO` | `idx_assigned` | 담당자별 상담 목록 |
| `TA_CONSULTATION_INFO` | `idx_created` | 최신 상담 정렬 |
| `TA_CONSULTATION_LOG_INFO` | `idx_consultation` | 상담별 히스토리 조회 |
| `TA_CUSTOMER_INFO` | `idx_phone` | 전화번호 검색 |

---

## 주요 쿼리 예시

### 메인 슬라이더 시공사례 조회

```sql
SELECT p.*, pi.image_url AS thumbnail
FROM TA_PORTFOLIO_INFO p
LEFT JOIN TA_PORTFOLIO_IMAGE_INFO pi ON pi.portfolio_id = p.portfolio_id AND pi.sort_order = 0
WHERE p.is_featured = 1 AND p.is_active = 1
ORDER BY p.completed_at DESC
LIMIT 5;
```

### 서비스별 시공사례 목록

```sql
SELECT p.*, s.title AS service_name
FROM TA_PORTFOLIO_INFO p
JOIN TA_SERVICE_INFO s ON s.service_id = p.service_id
WHERE s.slug = 'office' AND p.is_active = 1
ORDER BY p.completed_at DESC;
```

### 상담 신청 대시보드 (미처리 우선)

```sql
SELECT c.*, a.name AS admin_name
FROM TA_CONSULTATION_INFO c
LEFT JOIN TA_ADMIN_INFO a ON a.admin_id = c.assigned_admin_id
WHERE c.status IN ('pending', 'contacted')
ORDER BY
    CASE c.status WHEN 'pending' THEN 0 ELSE 1 END,
    c.created_at DESC;
```

### 월별 상담 통계

```sql
SELECT
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS total,
    SUM(status = 'contracted') AS contracted,
    ROUND(SUM(status = 'contracted') / COUNT(*) * 100, 1) AS conversion_rate
FROM TA_CONSULTATION_INFO
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;
```

---

## 설계 원칙

- **InnoDB 엔진**: 트랜잭션, 외래키 무결성, row-level locking 지원
- **utf8mb4**: 한글 및 이모지 완벽 지원
- **3NF 정규화**: 서비스-특징, 시공사례-이미지, 시공사례-태그 분리
- **ENUM 활용**: 상태값, 공간유형 등 고정 선택지에 적용
- **Soft Delete 미적용**: `is_active` 플래그로 비활성화 처리 (물리 삭제는 CASCADE)
- **타임스탬프 자동화**: `created_at`, `updated_at` 자동 관리
- **명명 규칙**: `TA_XXX_INFO` 형식 (대문자)

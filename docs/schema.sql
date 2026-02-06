-- =============================================
-- 타일마트 MariaDB 스키마
-- Engine: InnoDB / Charset: utf8mb4_unicode_ci
-- 테이블 명명규칙: TA_XXX_INFO (대문자)
-- =============================================

CREATE DATABASE IF NOT EXISTS tilemart
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE tilemart;

-- 1. 관리자
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
) ENGINE=InnoDB;

-- 2. 서비스 카테고리
CREATE TABLE TA_SERVICE_INFO (
    service_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(50) NOT NULL COMMENT '영문 표기',
    tagline VARCHAR(200) NOT NULL COMMENT '한줄 소개',
    description TEXT NOT NULL,
    image_url VARCHAR(500) NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#55c89f' COMMENT 'HEX 컬러',
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_slug (slug),
    INDEX idx_sort_active (sort_order, is_active)
) ENGINE=InnoDB;

-- 3. 서비스 특징
CREATE TABLE TA_SERVICE_FEATURE_INFO (
    feature_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_id INT UNSIGNED NOT NULL,
    content VARCHAR(200) NOT NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES TA_SERVICE_INFO(service_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_service_sort (service_id, sort_order)
) ENGINE=InnoDB;

-- 4. 시공사례
CREATE TABLE TA_PORTFOLIO_INFO (
    portfolio_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_id INT UNSIGNED NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    area VARCHAR(20) NOT NULL,
    cost VARCHAR(30) NOT NULL,
    duration VARCHAR(20) NULL,
    thumbnail_url VARCHAR(500) NULL,
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    completed_at DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_slug (slug),
    FOREIGN KEY (service_id) REFERENCES TA_SERVICE_INFO(service_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_service (service_id),
    INDEX idx_featured_active (is_featured, is_active),
    INDEX idx_completed (completed_at DESC)
) ENGINE=InnoDB;

-- 5. 시공사례 이미지
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
) ENGINE=InnoDB;

-- 6. 태그
CREATE TABLE TA_TAG_INFO (
    tag_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    UNIQUE KEY uk_slug (slug)
) ENGINE=InnoDB;

-- 7. 시공사례-태그 매핑
CREATE TABLE TA_PORTFOLIO_TAG_INFO (
    portfolio_id INT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (portfolio_id, tag_id),
    FOREIGN KEY (portfolio_id) REFERENCES TA_PORTFOLIO_INFO(portfolio_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES TA_TAG_INFO(tag_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. 고객
CREATE TABLE TA_CUSTOMER_INFO (
    customer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL,
    memo TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- 9. 상담 신청
CREATE TABLE TA_CONSULTATION_INFO (
    consultation_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    space_type ENUM('office','academy','fitness','residential','renovation','retail','fnb','other')
        NOT NULL DEFAULT 'other',
    area VARCHAR(20) NULL,
    message TEXT NULL,
    status ENUM('pending','contacted','visiting','quoted','contracted','cancelled')
        NOT NULL DEFAULT 'pending',
    assigned_admin_id INT UNSIGNED NULL,
    source ENUM('website','phone','kakao','walk_in','referral')
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
) ENGINE=InnoDB;

-- 10. 상담 진행 기록
CREATE TABLE TA_CONSULTATION_LOG_INFO (
    log_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    consultation_id INT UNSIGNED NOT NULL,
    admin_id INT UNSIGNED NULL,
    action ENUM('created','status_changed','note_added','assigned','called','visited')
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
) ENGINE=InnoDB;

-- 11. 사이트 설정
CREATE TABLE TA_SITE_SETTING_INFO (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description VARCHAR(200) NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 초기 데이터
INSERT INTO TA_SITE_SETTING_INFO (setting_key, setting_value, description) VALUES
('company_name', '타일마트', '회사명'),
('phone', '0507-1497-0485', '대표전화'),
('address', '경기 고양시 일산서구 경의로 826 전면상가좌측칸', '주소'),
('business_hours', '매일 08:00 - 18:30', '영업시간'),
('instagram_url', '', '인스타그램 URL'),
('youtube_url', '', '유튜브 URL'),
('kakao_url', '', '카카오톡 상담 URL');

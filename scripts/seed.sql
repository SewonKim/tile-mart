-- =============================================
-- 타일마트 초기 관리자 시드 데이터
-- 비밀번호: admin1234
-- bcrypt hash (12 rounds)
-- =============================================

INSERT INTO TA_ADMIN_INFO (email, password_hash, name, role) VALUES
('admin@tilemart.co.kr', '$2b$12$c7dthtW3McV.sIXU3VwM4.3TlwJ5pbeQsfU9AVbtUioRSr/OfjepG', '관리자', 'super_admin');

-- 초기 서비스 데이터
INSERT INTO TA_SERVICE_INFO (slug, title, subtitle, tagline, description, color, sort_order) VALUES
('office', '사무실', 'OFFICE', '업무 효율을 높이는 타일 시공', '사무실 공간에 최적화된 타일 시공 서비스입니다.', '#55c89f', 1),
('academy', '학원', 'ACADEMY', '학습에 집중할 수 있는 환경', '학원 및 교육 공간을 위한 맞춤 타일 시공 서비스입니다.', '#4BA3E3', 2),
('fitness', '체육시설', 'FITNESS', '안전하고 쾌적한 운동 공간', '체육시설 전용 내구성 높은 타일 시공 서비스입니다.', '#E8734A', 3),
('residential', '주거건물', 'RESIDENTIAL', '편안한 일상을 위한 공간', '주거 공간에 맞춤 타일 시공 서비스입니다.', '#D4A853', 4),
('renovation', '환경개선', 'RENOVATION', '새로운 공간으로 탈바꿈', '기존 공간을 새롭게 바꿔드리는 리모델링 시공입니다.', '#8B7EC8', 5),
('retail', '매장', 'RETAIL', '고객을 사로잡는 매장', '매장 및 상업 공간 타일 시공 서비스입니다.', '#E05D8C', 6),
('fnb', '카페/음식점', 'F&B', '분위기를 만드는 공간', '카페, 레스토랑 등 F&B 공간 타일 시공 서비스입니다.', '#55c89f', 7);

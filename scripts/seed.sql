-- =============================================
-- 타일마트 시드 데이터
-- =============================================

-- 1. 관리자 (비밀번호: admin1234)
INSERT INTO TA_ADMIN_INFO (email, password_hash, name, role) VALUES
('admin@tilemart.co.kr', '$2b$12$c7dthtW3McV.sIXU3VwM4.3TlwJ5pbeQsfU9AVbtUioRSr/OfjepG', '관리자', 'super_admin');

-- 2. 서비스
INSERT INTO TA_SERVICE_INFO (slug, title, subtitle, tagline, description, image_url, color, sort_order) VALUES
('office', '사무실', 'OFFICE', '공간이 바뀌면, 일이 달라집니다', '업무 효율을 극대화하는 오피스 설계. 소통과 집중의 균형을 맞춘 최적의 사무 환경을 만듭니다. 기업 문화와 브랜드에 맞는 맞춤형 오피스 인테리어를 제공합니다.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop', '#55c89f', 1),
('academy', '학원', 'ACADEMY', '집중력을 높이는 교육 공간', '학생들의 학습 효율과 몰입도를 높이는 교육 공간 전문 설계. 연령대와 교육 목적에 맞춘 최적의 학습 환경을 만들어드립니다.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=800&fit=crop', '#4BA3E3', 2),
('fitness', '체육시설', 'FITNESS', '몰입할 수 있는 운동 환경', '종목별 특성에 맞춘 기능적이고 안전한 운동 공간. 고하중 바닥재, 방진 시스템, 환기 설비 등 체육시설에 특화된 시공을 제공합니다.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop', '#E8734A', 3),
('residential', '주거건물', 'RESIDENTIAL', '삶의 질을 높이는 주거 공간', '입주자의 라이프스타일에 맞춘 주거 공간 리모델링. 수납 최적화, 동선 개선, 단열 시공 등 실용적이면서도 감각적인 주거 인테리어를 제공합니다.', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', '#D4A853', 4),
('renovation', '환경개선', 'RENOVATION', '노후 공간의 새로운 탈바꿈', '낡고 비효율적인 공간을 현대적이고 쾌적하게 탈바꿈합니다. 구조 보강부터 마감 시공까지 체계적인 환경 개선 솔루션을 제공합니다.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=800&fit=crop', '#8B7EC8', 5),
('retail', '매장', 'RETAIL', '브랜드를 담은 매장 설계', '브랜드 스토리와 매출을 동시에 잡는 매장 인테리어. 고객 동선 최적화와 상품 디스플레이 설계로 매출 상승 효과를 이끌어냅니다.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop', '#E05D8C', 6),
('fnb', '카페/음식점', 'F&B', '다시 찾고 싶은 경험 공간', '고객이 다시 찾고 싶은 경험 중심의 F&B 공간. 브랜드 감성을 살린 인테리어와 효율적인 주방 동선으로 운영과 분위기를 모두 잡습니다.', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=800&fit=crop', '#55c89f', 7);

-- 3. 서비스 특징
INSERT INTO TA_SERVICE_FEATURE_INFO (service_id, content, sort_order) VALUES
-- office (service_id=1)
(1, '기업 문화를 반영한 공간 콘셉트 기획', 0),
(1, '협업과 집중의 균형을 맞춘 레이아웃', 1),
(1, '자연광과 조명을 활용한 쾌적한 환경', 2),
(1, 'IT 인프라 및 전기 배선 최적화', 3),
(1, '회의실, 라운지, 포커스룸 등 다목적 공간', 4),
(1, '브랜딩 요소를 반영한 인테리어 디자인', 5),
-- academy (service_id=2)
(2, '연령대별 맞춤형 교실 설계', 0),
(2, '방음 처리된 소그룹 스터디룸', 1),
(2, '집중력 향상을 위한 조명 및 색채 설계', 2),
(2, '안전한 마감재 및 가구 선정', 3),
(2, '대기 공간 및 상담실 분리 구성', 4),
(2, '효율적 동선을 고려한 복도 및 출입구', 5),
-- fitness (service_id=3)
(3, '종목별 특성을 반영한 공간 설계', 0),
(3, '고하중 바닥재 및 방진 시스템', 1),
(3, '최적 환기 및 공조 시스템 설계', 2),
(3, '안전을 고려한 장비 배치 동선', 3),
(3, '탈의실, 샤워실 등 부대시설 설계', 4),
(3, '에너지 효율적 조명 및 음향 시스템', 5),
-- residential (service_id=4)
(4, '가족 구성원별 맞춤 공간 설계', 0),
(4, '빌트인 수납 시스템으로 공간 효율화', 1),
(4, '에너지 효율을 고려한 단열 시공', 2),
(4, '주방-거실 개방형 구조 설계', 3),
(4, '고급 마감재 및 조명 연출', 4),
(4, '생활 동선 최적화', 5),
-- renovation (service_id=5)
(5, '기존 구조 진단 및 보강 설계', 0),
(5, '노후 설비 교체 및 업그레이드', 1),
(5, '에너지 효율 개선 (단열, 창호)', 2),
(5, '현대적 마감재 적용', 3),
(5, '안전 기준에 맞춘 전기/소방 시공', 4),
(5, '최소 영업 중단으로 빠른 시공', 5),
-- retail (service_id=6)
(6, '브랜드 아이덴티티를 반영한 공간 콘셉트', 0),
(6, '고객 동선 분석 기반 진열대 배치', 1),
(6, '포인트 조명으로 상품 주목도 향상', 2),
(6, '피팅룸 및 결제 공간 효율화', 3),
(6, '파사드 및 간판 디자인', 4),
(6, '시즌별 디스플레이 변경 용이한 구조', 5),
-- fnb (service_id=7)
(7, '브랜드 콘셉트를 반영한 공간 연출', 0),
(7, '효율적 주방 동선 및 설비 배치', 1),
(7, '인스타그래머블한 포토존 설계', 2),
(7, '간접 조명을 활용한 분위기 연출', 3),
(7, '좌석 배치 최적화 (회전율 고려)', 4),
(7, '위생 기준에 맞춘 마감재 선정', 5);

-- 4. 태그
INSERT INTO TA_TAG_INFO (name, slug) VALUES
('사무실', 'office'),
('학원', 'academy'),
('체육시설', 'fitness'),
('카페/음식점', 'fnb'),
('매장', 'retail'),
('주거', 'residential'),
('환경개선', 'renovation');

-- 5. 시공사례
INSERT INTO TA_PORTFOLIO_INFO (service_id, title, slug, description, location, area, cost, duration, thumbnail_url, is_featured, is_active, completed_at) VALUES
(1, 'IT 스타트업 오피스', 'it-startup-office', '개방적이고 창의적인 업무 환경을 위한 오피스 인테리어. 협업 공간과 집중 공간을 균형 있게 배치하여 업무 효율을 극대화했습니다.', '대구 수성구', '52평', '4,200만원', '4주', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop', 1, 1, '2025-11-15'),
(2, '영어 전문 학원', 'english-academy', '학생들의 집중력과 학습 몰입도를 높이는 교육 공간. 밝은 색감과 기능적 동선 설계로 쾌적한 학습 환경을 조성했습니다.', '대구 달서구', '38평', '3,100만원', '3주', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=800&fit=crop', 1, 1, '2025-10-20'),
(3, '크로스핏 전문 센터', 'crossfit-center', '고강도 운동에 최적화된 체육 시설. 내구성 높은 자재와 안전한 동선 설계로 운동에 몰입할 수 있는 환경을 만들었습니다.', '대구 북구', '65평', '5,800만원', '5주', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop', 1, 1, '2025-09-10'),
(7, '디저트 카페 브랜딩', 'dessert-cafe', '브랜드 아이덴티티를 공간에 녹여낸 디저트 카페. 따뜻한 색감과 감각적인 조명으로 고객이 머물고 싶은 공간을 완성했습니다.', '대구 중구', '28평', '2,600만원', '3주', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=800&fit=crop', 1, 1, '2025-12-01'),
(6, '패션 편집숍 리뉴얼', 'fashion-shop', '브랜드 스토리를 공간으로 표현한 패션 매장. 동선 최적화와 디스플레이 설계로 매출 상승 효과를 이끌어냈습니다.', '대구 동구', '34평', '2,900만원', '3주', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop', 0, 1, '2025-08-15'),
(1, '법률사무소 인테리어', 'law-office', '신뢰감을 주는 고급스러운 법률사무소. 클라이언트 접견실과 업무 공간을 격조 있게 분리 설계했습니다.', '대구 수성구', '45평', '3,800만원', '4주', 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop', 0, 1, '2025-07-20'),
(4, '신축 아파트 리모델링', 'apartment-remodel', '기본형 아파트를 입주자의 라이프스타일에 맞춰 커스터마이징. 수납과 동선을 최적화한 실용적인 주거 공간입니다.', '대구 달서구', '32평', '3,500만원', '4주', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', 0, 1, '2025-06-10'),
(2, '코딩 교육센터', 'coding-academy', '디지털 교육에 최적화된 코딩 학원. 개인 작업 공간과 팀 프로젝트 공간을 균형 있게 구성했습니다.', '대구 수성구', '42평', '3,400만원', '3주', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop', 0, 1, '2025-05-15');

-- 6. 시공사례 이미지 (portfolio_id는 위 INSERT 순서대로 1~8)
INSERT INTO TA_PORTFOLIO_IMAGE_INFO (portfolio_id, image_url, alt_text, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop', 'IT 스타트업 오피스 - 이미지 1', 0),
(1, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop', 'IT 스타트업 오피스 - 이미지 2', 1),
(1, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=800&fit=crop', 'IT 스타트업 오피스 - 이미지 3', 2),
(2, 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=800&fit=crop', '영어 전문 학원 - 이미지 1', 0),
(2, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=800&fit=crop', '영어 전문 학원 - 이미지 2', 1),
(2, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop', '영어 전문 학원 - 이미지 3', 2),
(3, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop', '크로스핏 전문 센터 - 이미지 1', 0),
(3, 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop', '크로스핏 전문 센터 - 이미지 2', 1),
(3, 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&h=800&fit=crop', '크로스핏 전문 센터 - 이미지 3', 2),
(4, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=800&fit=crop', '디저트 카페 브랜딩 - 이미지 1', 0),
(4, 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&h=800&fit=crop', '디저트 카페 브랜딩 - 이미지 2', 1),
(4, 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&h=800&fit=crop', '디저트 카페 브랜딩 - 이미지 3', 2),
(5, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop', '패션 편집숍 리뉴얼 - 이미지 1', 0),
(5, 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&h=800&fit=crop', '패션 편집숍 리뉴얼 - 이미지 2', 1),
(5, 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&h=800&fit=crop', '패션 편집숍 리뉴얼 - 이미지 3', 2),
(6, 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop', '법률사무소 인테리어 - 이미지 1', 0),
(6, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop', '법률사무소 인테리어 - 이미지 2', 1),
(6, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop', '법률사무소 인테리어 - 이미지 3', 2),
(7, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', '신축 아파트 리모델링 - 이미지 1', 0),
(7, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop', '신축 아파트 리모델링 - 이미지 2', 1),
(7, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop', '신축 아파트 리모델링 - 이미지 3', 2),
(8, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop', '코딩 교육센터 - 이미지 1', 0),
(8, 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop', '코딩 교육센터 - 이미지 2', 1),
(8, 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=800&fit=crop', '코딩 교육센터 - 이미지 3', 2);

-- 7. 시공사례-태그 매핑
INSERT INTO TA_PORTFOLIO_TAG_INFO (portfolio_id, tag_id) VALUES
(1, 1), -- IT 스타트업 오피스 → 사무실
(2, 2), -- 영어 전문 학원 → 학원
(3, 3), -- 크로스핏 전문 센터 → 체육시설
(4, 4), -- 디저트 카페 브랜딩 → 카페/음식점
(5, 5), -- 패션 편집숍 리뉴얼 → 매장
(6, 1), -- 법률사무소 인테리어 → 사무실
(7, 6), -- 신축 아파트 리모델링 → 주거
(8, 2); -- 코딩 교육센터 → 학원

-- 8. 사이트 설정
INSERT INTO TA_SITE_SETTING_INFO (setting_key, setting_value, description) VALUES
('company_name', '타일마트', '회사명'),
('phone', '0507-1497-0485', '대표전화'),
('address', '경기 고양시 일산서구 경의로 826 전면상가좌측칸', '주소'),
('business_hours', '매일 08:00 - 18:30', '영업시간'),
('instagram_url', '', '인스타그램 URL'),
('youtube_url', '', '유튜브 URL'),
('kakao_url', '', '카카오톡 상담 URL');

// ==========================================
// ENUM 한글 라벨 및 상태 색상
// ==========================================

export const SPACE_TYPE_LABELS: Record<string, string> = {
  office: '사무실',
  academy: '학원',
  fitness: '체육시설',
  residential: '주거공간',
  renovation: '환경개선',
  retail: '매장',
  fnb: '카페/음식점',
  other: '기타',
}

export const STATUS_LABELS: Record<string, string> = {
  pending: '대기중',
  contacted: '연락완료',
  visiting: '방문예정',
  quoted: '견적전달',
  contracted: '계약완료',
  cancelled: '취소',
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  visiting: 'bg-purple-100 text-purple-800',
  quoted: 'bg-orange-100 text-orange-800',
  contracted: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-500',
}

export const SOURCE_LABELS: Record<string, string> = {
  website: '웹사이트',
  phone: '전화',
  kakao: '카카오톡',
  walk_in: '방문',
  referral: '소개',
}

export const LOG_ACTION_LABELS: Record<string, string> = {
  created: '상담 생성',
  status_changed: '상태 변경',
  note_added: '메모 추가',
  assigned: '담당자 배정',
  called: '전화 연락',
  visited: '현장 방문',
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin: '최고관리자',
  admin: '관리자',
  editor: '에디터',
}

export const PAGE_SIZE = 20

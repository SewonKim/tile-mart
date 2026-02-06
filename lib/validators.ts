export function validateRequired(value: string, fieldName: string): string | null {
  return value.trim() ? null : `${fieldName}을(를) 입력해주세요.`
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return null
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value) ? null : '유효한 이메일을 입력해주세요.'
}

export function validatePhone(value: string): string | null {
  if (!value.trim()) return null
  const re = /^[\d-]+$/
  return re.test(value) ? null : '유효한 전화번호를 입력해주세요.'
}

export function validateSlug(value: string): string | null {
  if (!value.trim()) return null
  const re = /^[a-z0-9-]+$/
  return re.test(value) ? null : '영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.'
}

export function validateHexColor(value: string): string | null {
  if (!value.trim()) return null
  const re = /^#[0-9A-Fa-f]{6}$/
  return re.test(value) ? null : '유효한 HEX 색상을 입력해주세요.'
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

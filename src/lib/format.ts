const dateFormatter = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(date: Date | null): string {
  return date ? dateFormatter.format(date) : '방금 전'
}

export function formatDateTime(date: Date | null): string {
  return date ? dateTimeFormatter.format(date) : '방금 전'
}

/** http(s)로 시작하는 안전한 주소인지 확인 */
export function isSafeUrl(url: string): boolean {
  return /^https?:\/\/\S+$/i.test(url.trim())
}

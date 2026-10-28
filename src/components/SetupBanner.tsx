import { isFirebaseConfigured } from '../lib/data'

export function SetupBanner() {
  if (isFirebaseConfigured) return null
  return (
    <div className="border-b border-amber-200 bg-amber-50 text-amber-900">
      <div className="mx-auto max-w-5xl px-4 py-2.5 text-sm">
        <strong className="font-semibold">Firebase 미설정 모드</strong> — 지금은 샘플 데이터를 읽기 전용으로 보여주고 있습니다.
        로그인, 글쓰기, 댓글은 Firebase를 연결한 뒤 사용할 수 있습니다. (README의 4~9단계 참고)
      </div>
    </div>
  )
}

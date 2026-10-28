import { useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import { ErrorState, Loading } from '../components/States'
import { useAuth } from '../hooks/useAuth'
import { data, errorMessage } from '../lib/data'

export function LoginPage() {
  const { loading, user, isMember, signIn, error: authError } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/research'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!data.readOnly) {
    if (loading) return <Loading label="로그인 정보를 확인하는 중입니다…" />
    if (user && isMember) return <Navigate to={from} replace />
    if (user) return <Navigate to="/pending" replace />
  }

  const handleSignIn = async () => {
    setBusy(true)
    setError(null)
    try {
      await signIn()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
        <h1 className="font-serif text-2xl font-bold text-stone-900">로그인</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          연구, 수업자료, 토론 게시판은 승인된 연구실 구성원만 볼 수 있습니다.
          <br />
          처음 로그인하면 교수님의 승인을 받은 뒤 이용할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy || data.readOnly}
          className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded border border-stone-300 bg-white px-4 py-2.5 font-medium text-stone-700 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          {busy ? '로그인 중…' : 'Google 계정으로 로그인'}
        </button>
        {data.readOnly && (
          <p className="mt-4 text-sm text-amber-700">
            Firebase 미설정 모드에서는 로그인할 수 없습니다. 지금은 모든 화면을 샘플 데이터로 둘러볼 수 있습니다.
          </p>
        )}
      </div>
      {(error || authError) && (
        <div className="mt-4">
          <ErrorState message={(error || authError) as string} />
        </div>
      )}
    </div>
  )
}

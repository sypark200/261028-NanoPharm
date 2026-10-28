import { Link, Navigate } from 'react-router'
import { Loading } from '../components/States'
import { useAuth } from '../hooks/useAuth'
import { data } from '../lib/data'

export function PendingPage() {
  const { loading, user, isMember } = useAuth()

  if (!data.readOnly) {
    if (loading) return <Loading />
    if (!user) return <Navigate to="/login" replace />
    if (isMember) return <Navigate to="/research" replace />
  }

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-stone-200 bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl" aria-hidden>
        ⏳
      </div>
      <h1 className="mt-4 font-serif text-2xl font-bold text-stone-900">승인 대기 중입니다</h1>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">
        {data.readOnly ? '처음 로그인한 사용자에게 보이는 화면입니다.' : `${user?.displayName}님, 가입 신청이 접수되었습니다.`}
        <br />
        교수님이 승인하면 연구, 수업자료, 토론 게시판을 이용할 수 있습니다.
        <br />
        승인 후에는 이 페이지를 새로고침해 주세요.
      </p>
      {!data.readOnly && user?.email && <p className="mt-4 text-xs text-stone-400">로그인 계정: {user.email}</p>}
      <div className="mt-6 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          새로고침
        </button>
        <Link to="/" className="rounded border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
          홈으로
        </Link>
      </div>
    </div>
  )
}

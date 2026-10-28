import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <p className="font-serif text-5xl font-bold text-brand-700">404</p>
      <h1 className="mt-3 text-xl font-semibold text-stone-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-stone-600">주소가 바뀌었거나 삭제된 페이지일 수 있습니다.</p>
      <Link to="/" className="mt-6 inline-block rounded bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">
        홈으로 돌아가기
      </Link>
    </div>
  )
}

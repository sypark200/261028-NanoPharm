import type { ReactNode } from 'react'

export function Loading({ label = '불러오는 중입니다…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-stone-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-brand-700" />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-sm border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
      <p className="font-medium text-stone-700">{title}</p>
      {children && <div className="mt-2 text-sm text-stone-500">{children}</div>}
    </div>
  )
}

/** 오류 문구 속 주소(예: Firestore 색인 생성 링크)는 누를 수 있는 링크로 보여줍니다 */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const parts = message.split(/(https?:\/\/\S+)/g)
  return (
    <div className="rounded-sm border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800" role="alert">
      <p className="font-medium">문제가 발생했습니다</p>
      <p className="mt-1 whitespace-pre-line break-all">
        {parts.map((part, i) =>
          /^https?:\/\//.test(part) ? (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline">
              {part}
            </a>
          ) : (
            part
          ),
        )}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 rounded-sm border border-red-300 bg-white px-3 py-1 text-red-700 hover:bg-red-100">
          다시 시도
        </button>
      )}
    </div>
  )
}

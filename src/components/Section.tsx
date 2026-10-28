import type { ReactNode } from 'react'
import { Link } from 'react-router'

/** 화면 폭 전체로 펼쳐지는 영역 (본문 폭 제한을 벗어남) */
export function FullBleed({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`relative left-1/2 w-screen -translate-x-1/2 ${className}`}>{children}</div>
}

/** 영문 소제목 + 한글 제목 + 금색 짧은 선 */
export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-500">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold text-brand-800 sm:text-[1.7rem]">{title}</h2>
      <span className="mt-3 block h-[3px] w-10 bg-accent-500" aria-hidden />
    </div>
  )
}

/**
 * 게시판·관리 화면 위쪽의 남색 제목 띠.
 * 경로 표시(홈 › 연구)와 오른쪽 버튼 자리를 함께 둡니다.
 */
export function PageHeader({
  title,
  description,
  crumbs = [],
  actions,
}: {
  title: string
  description?: string
  crumbs?: { label: string; to?: string }[]
  actions?: ReactNode
}) {
  return (
    <FullBleed className="-mt-8 mb-8 bg-brand-800 text-white sm:-mt-10 sm:mb-10">
      <div className="pattern-molecule">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-4 px-4 py-9 sm:py-11">
          <div>
            <nav className="text-xs text-brand-200" aria-label="현재 위치">
              <Link to="/" className="hover:text-white">
                홈
              </Link>
              {crumbs.map((c) => (
                <span key={c.label}>
                  <span className="mx-1.5" aria-hidden>
                    ›
                  </span>
                  {c.to ? (
                    <Link to={c.to} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
            <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{title}</h1>
            {description && <p className="mt-2 text-sm text-brand-100">{description}</p>}
          </div>
          {actions}
        </div>
      </div>
      <div className="h-1 bg-accent-500" aria-hidden />
    </FullBleed>
  )
}

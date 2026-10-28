import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { lab } from '../content/lab'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, CATEGORY_ORDER } from '../lib/categories'
import { data } from '../lib/data'
import { Avatar } from './Avatar'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-3 py-2 text-sm transition-colors ${
    isActive ? 'bg-brand-50 font-semibold text-brand-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`

export function Navbar() {
  const { user, isMember, isAdmin, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={close}>
        홈
      </NavLink>
      {CATEGORY_ORDER.map((c) => (
        <NavLink key={c} to={CATEGORIES[c].path} className={linkClass} onClick={close}>
          {CATEGORIES[c].label}
        </NavLink>
      ))}
      {isAdmin && (
        <NavLink to="/admin/members" className={linkClass} onClick={close}>
          회원 관리
        </NavLink>
      )}
    </>
  )

  const account = loading ? (
    <span className="text-sm text-stone-400">확인 중…</span>
  ) : user ? (
    <div className="flex items-center gap-2">
      <Avatar name={user.displayName} photoURL={user.photoURL} />
      <div className="text-sm leading-tight">
        <div className="font-medium text-stone-800">{user.displayName}</div>
        <div className="text-xs text-stone-500">
          {user.role === 'admin' ? '관리자' : user.role === 'member' ? '회원' : '승인 대기'}
        </div>
      </div>
      {!data.readOnly && (
        <button
          type="button"
          onClick={() => {
            close()
            void signOut()
          }}
          className="ml-1 rounded border border-stone-300 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100"
        >
          로그아웃
        </button>
      )}
    </div>
  ) : (
    <Link
      to="/login"
      onClick={close}
      className="rounded bg-brand-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-800"
    >
      로그인
    </Link>
  )

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-baseline gap-2" onClick={close}>
          <span className="font-serif text-lg font-bold text-brand-700">{lab.name}</span>
          <span className="hidden text-xs tracking-wide text-stone-400 sm:inline">{lab.nameEn}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="주 메뉴">
          {links}
        </nav>
        <div className="hidden md:block">{account}</div>

        <button
          type="button"
          className="rounded p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-200 px-4 pb-4 md:hidden">
          <nav className="flex flex-col py-2" aria-label="주 메뉴">
            {links}
          </nav>
          <div className="border-t border-stone-100 pt-3">{account}</div>
        </div>
      )}
      {!isMember && user?.role === 'pending' && (
        <div className="bg-stone-100 px-4 py-1.5 text-center text-xs text-stone-600">
          관리자 승인을 기다리고 있습니다.
        </div>
      )}
    </header>
  )
}

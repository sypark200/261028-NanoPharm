import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { lab } from '../content/lab'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, CATEGORY_ORDER } from '../lib/categories'
import { data } from '../lib/data'
import { Avatar } from './Avatar'

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  `relative flex h-full items-center px-4 text-[15px] font-semibold transition-colors ${
    isActive
      ? 'text-brand-700 after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-brand-700'
      : 'text-stone-700 hover:text-brand-700'
  }`

const mobileLink = ({ isActive }: { isActive: boolean }) =>
  `block border-l-[3px] px-4 py-3 text-[15px] font-semibold ${
    isActive ? 'border-brand-700 bg-brand-50 text-brand-700' : 'border-transparent text-stone-700'
  }`

function Emblem() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <circle cx="20" cy="20" r="19" fill="#1e3a5f" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#b8963e" strokeWidth="1.2" />
      <path d="M20 10 L28.7 15 L28.7 25 L20 30 L11.3 25 L11.3 15 Z" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="20" cy="20" r="3.2" fill="#d4b45c" />
    </svg>
  )
}

export function Navbar() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const menu = [
    { to: '/', label: '홈', end: true },
    ...CATEGORY_ORDER.map((c) => ({ to: CATEGORIES[c].path, label: CATEGORIES[c].label, end: false })),
    ...(isAdmin ? [{ to: '/admin/members', label: '회원 관리', end: false }] : []),
  ]

  const roleLabel = user?.role === 'admin' ? '관리자' : user?.role === 'member' ? '회원' : '승인 대기'

  const handleSignOut = () => {
    close()
    void signOut()
  }

  return (
    <>
      {/* 맨 위 남색 띠: 소속과 로그인 정보 */}
      <div className="bg-brand-900 text-xs text-brand-100">
        <div className="mx-auto flex h-9 max-w-5xl items-center justify-between gap-4 px-4">
          <span className="truncate">{lab.affiliation}</span>
          <div className="hidden items-center gap-3 md:flex">
            {loading ? (
              <span className="text-brand-200">확인 중…</span>
            ) : user ? (
              <>
                <span className="flex items-center gap-2">
                  <Avatar name={user.displayName} photoURL={user.photoURL} size={22} />
                  <span className="text-white">{user.displayName}</span>
                  <span className="rounded-sm bg-white/10 px-1.5 py-0.5 text-[11px]">{roleLabel}</span>
                </span>
                {!data.readOnly && (
                  <button type="button" onClick={handleSignOut} className="hover:text-white">
                    로그아웃
                  </button>
                )}
              </>
            ) : (
              <Link to="/login" className="font-medium text-white hover:text-accent-400">
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 연구실 이름과 주 메뉴 */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="mx-auto flex h-[68px] max-w-5xl items-stretch justify-between px-4">
          <Link to="/" className="flex items-center gap-3" onClick={close}>
            <Emblem />
            <span className="leading-tight">
              <span className="block font-serif text-lg font-bold text-brand-800 sm:text-xl">{lab.name}</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">{lab.nameEn}</span>
            </span>
          </Link>

          <nav className="hidden items-stretch md:flex" aria-label="주 메뉴">
            {menu.map((m) => (
              <NavLink key={m.to} to={m.to} end={m.end} className={desktopLink}>
                {m.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="my-auto rounded-sm p-2 text-brand-800 hover:bg-stone-100 md:hidden"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="border-t border-stone-200 bg-white md:hidden">
            <nav className="flex flex-col py-1" aria-label="주 메뉴">
              {menu.map((m) => (
                <NavLink key={m.to} to={m.to} end={m.end} className={mobileLink} onClick={close}>
                  {m.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-stone-100 bg-stone-50 px-4 py-3">
              {loading ? (
                <span className="text-sm text-stone-400">확인 중…</span>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Avatar name={user.displayName} photoURL={user.photoURL} />
                  <div className="text-sm leading-tight">
                    <div className="font-medium text-stone-800">{user.displayName}</div>
                    <div className="text-xs text-stone-500">{roleLabel}</div>
                  </div>
                  {!data.readOnly && (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="ml-auto rounded-sm border border-stone-300 px-2.5 py-1 text-xs text-stone-600"
                    >
                      로그아웃
                    </button>
                  )}
                </div>
              ) : (
                <Link to="/login" onClick={close} className="block rounded-sm bg-brand-700 px-3 py-2 text-center text-sm font-medium text-white">
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
        {user?.role === 'pending' && (
          <div className="bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-800">관리자 승인을 기다리고 있습니다.</div>
        )}
      </header>
    </>
  )
}

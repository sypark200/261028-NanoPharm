import { Link, Outlet } from 'react-router'
import { lab } from '../content/lab'
import { CATEGORIES, CATEGORY_ORDER } from '../lib/categories'
import { Navbar } from './Navbar'
import { SetupBanner } from './SetupBanner'

export function Layout() {
  const { contact } = lab
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <SetupBanner />
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        <Outlet />
      </main>
      <footer className="bg-brand-900 text-sm text-brand-200">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-[1.4fr_1fr_auto]">
          <div>
            <p className="font-serif text-lg font-bold text-white">{lab.name}</p>
            <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-brand-200">{lab.nameEn}</p>
            <p className="mt-3">{lab.affiliation}</p>
            <p>지도교수 {lab.professor}</p>
          </div>
          <address className="space-y-1 not-italic">
            {contact.address && <p>{contact.address}</p>}
            {contact.office && <p>{contact.office}</p>}
            {contact.phone && <p>전화 {contact.phone}</p>}
            {contact.email && (
              <p>
                이메일{' '}
                <a href={`mailto:${contact.email}`} className="text-white hover:text-accent-400">
                  {contact.email}
                </a>
              </p>
            )}
          </address>
          <nav className="flex gap-4 sm:flex-col sm:gap-1.5" aria-label="바로가기">
            {CATEGORY_ORDER.map((c) => (
              <Link key={c} to={CATEGORIES[c].path} className="hover:text-white">
                {CATEGORIES[c].label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-brand-200/80">
            © {new Date().getFullYear()} {lab.nameEn}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

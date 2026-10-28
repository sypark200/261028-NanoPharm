import { Outlet } from 'react-router'
import { lab } from '../content/lab'
import { Navbar } from './Navbar'
import { SetupBanner } from './SetupBanner'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SetupBanner />
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-stone-500">
          © {new Date().getFullYear()} {lab.name} · {lab.affiliation}
        </div>
      </footer>
    </div>
  )
}

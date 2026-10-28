import { Link } from 'react-router'
import { FullBleed, SectionTitle } from '../components/Section'
import { lab } from '../content/lab'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, CATEGORY_ORDER } from '../lib/categories'

const QUICK_ICONS: Record<string, string> = {
  research: 'M9 3h6M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3M7.5 15h9',
  lecture: 'M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z',
  discussion: 'M4 5h12v9H8l-4 3zM16 9h4v9l-3-2.5h-6V14',
}

export function HomePage() {
  const { isMember } = useAuth()
  const { contact } = lab
  const contactRows = [
    { label: '이메일', value: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
    { label: '전화', value: contact.phone },
    { label: '연구실', value: contact.office },
    { label: '주소', value: contact.address },
  ].filter((row) => row.value)

  return (
    <div>
      {/* 대표 영역 */}
      <FullBleed className="-mt-8 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 text-white sm:-mt-10">
        <div className="pattern-molecule">
          <div className="mx-auto max-w-5xl px-4 pb-24 pt-14 sm:pb-28 sm:pt-20">
            <p className="text-sm font-medium tracking-wide text-accent-400">{lab.affiliation}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl">{lab.name}</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-brand-100 sm:text-base">{lab.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={isMember ? '/research' : '/login'}
                className="rounded-sm bg-white px-5 py-2.5 text-sm font-semibold text-brand-800 hover:bg-brand-50"
              >
                {isMember ? '연구 게시판 바로가기' : '연구실 구성원 로그인'}
              </Link>
              <a href="#research-areas" className="rounded-sm border border-white/50 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                연구 분야 보기
              </a>
            </div>
          </div>
        </div>
      </FullBleed>

      {/* 게시판 바로가기 */}
      <div className="relative -mt-14 grid gap-3 sm:-mt-16 sm:grid-cols-3">
        {CATEGORY_ORDER.map((c) => (
          <Link
            key={c}
            to={CATEGORIES[c].path}
            className="group flex items-start gap-4 border-t-[3px] border-accent-500 bg-white p-5 shadow-md transition-shadow hover:shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 group-hover:bg-brand-700 group-hover:text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={QUICK_ICONS[c]} />
              </svg>
            </span>
            <span>
              <span className="flex items-center gap-1 font-bold text-brand-800">
                {CATEGORIES[c].label}
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                  →
                </span>
              </span>
              <span className="mt-1 block text-sm leading-snug text-stone-600">{CATEGORIES[c].description}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* 연구실 소개 */}
      <section className="mt-16 grid gap-6 sm:mt-20 md:grid-cols-[14rem_1fr]">
        <SectionTitle eyebrow="About" title="연구실 소개" />
        <div className="space-y-4 leading-relaxed text-stone-700">
          {lab.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="pt-1 text-sm text-stone-500">
            지도교수 <span className="font-semibold text-stone-800">{lab.professor}</span>
          </p>
        </div>
      </section>

      {/* 연구 분야 */}
      <section id="research-areas" className="mt-16 scroll-mt-24 border-t border-stone-200 pt-14 sm:mt-20">
        <SectionTitle eyebrow="Research" title="연구 분야" />
        <div className="mt-8 grid gap-px overflow-hidden border border-stone-200 bg-stone-200 sm:grid-cols-2">
          {lab.researchAreas.map((area, i) => (
            <div key={area.title} className="bg-white p-6">
              <p className="font-serif text-2xl font-bold text-accent-500">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-lg font-bold text-brand-800">{area.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 연락처 */}
      <section className="mt-16 border-t border-stone-200 pt-14 sm:mt-20">
        <SectionTitle eyebrow="Contact" title="연락처" />
        <dl className="mt-8 border-t-2 border-brand-800 bg-white text-sm">
          {contactRows.map((row) => (
            <div key={row.label} className="grid grid-cols-[6rem_1fr] border-b border-stone-200 sm:grid-cols-[9rem_1fr]">
              <dt className="bg-stone-50 px-4 py-3.5 font-semibold text-stone-600">{row.label}</dt>
              <dd className="px-4 py-3.5 text-stone-800">
                {row.href ? (
                  <a href={row.href} className="text-brand-600 hover:underline">
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

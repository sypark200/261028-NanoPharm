import { Link } from 'react-router'
import { lab } from '../content/lab'
import { useAuth } from '../hooks/useAuth'

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
    <div className="space-y-14">
      <section className="border-b border-stone-200 pb-10">
        <p className="text-sm font-medium tracking-wide text-brand-600">{lab.affiliation}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">{lab.name}</h1>
        <p className="mt-1 text-stone-500">
          {lab.nameEn} · 지도교수 {lab.professor}
        </p>
        <div className="mt-6 max-w-3xl space-y-3 leading-relaxed text-stone-700">
          {lab.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-6">
          <Link
            to={isMember ? '/research' : '/login'}
            className="inline-block rounded bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            {isMember ? '연구 게시판으로 가기' : '연구실 구성원 로그인'}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold text-stone-900">연구 분야</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {lab.researchAreas.map((area) => (
            <div key={area.title} className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-brand-700">{area.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold text-stone-900">연락처</h2>
        <dl className="mt-5 grid gap-x-6 gap-y-3 rounded-lg border border-stone-200 bg-white p-5 text-sm sm:grid-cols-[6rem_1fr]">
          {contactRows.map((row) => (
            <div key={row.label} className="contents">
              <dt className="font-medium text-stone-500">{row.label}</dt>
              <dd className="text-stone-800">
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

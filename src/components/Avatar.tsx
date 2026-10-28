import { useState } from 'react'

export function Avatar({ name, photoURL, size = 32 }: { name: string; photoURL: string | null; size?: number }) {
  const [broken, setBroken] = useState(false)
  const style = { width: size, height: size }
  if (photoURL && !broken) {
    return (
      <img
        src={photoURL}
        alt={`${name} 프로필 사진`}
        style={style}
        className="rounded-full object-cover ring-1 ring-stone-200"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    )
  }
  return (
    <span
      style={style}
      className="inline-flex items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
      aria-hidden
    >
      {name.trim().charAt(0) || '?'}
    </span>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Avatar } from '../components/Avatar'
import { ReadOnlyNotice } from '../components/ReadOnlyNotice'
import { PageHeader } from '../components/Section'
import { EmptyState, ErrorState, Loading } from '../components/States'
import { useAuth } from '../hooks/useAuth'
import { data, errorMessage } from '../lib/data'
import { formatDate } from '../lib/format'
import type { AppUser, Role } from '../types'

interface Groups {
  pending: AppUser[]
  member: AppUser[]
  admin: AppUser[]
}

export function MembersPage() {
  const { user: me } = useAuth()
  const [groups, setGroups] = useState<Groups | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyUid, setBusyUid] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [pending, member, admin] = await Promise.all([
        data.listUsersByRole('pending'),
        data.listUsersByRole('member'),
        data.listUsersByRole('admin'),
      ])
      setGroups({ pending, member, admin })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const changeRole = async (target: AppUser, role: Role) => {
    const message =
      role === 'member'
        ? `${target.displayName}(${target.email})님을 회원으로 승인할까요?`
        : `${target.displayName}(${target.email})님의 회원 권한을 해제할까요?\n해제하면 다시 승인 대기 상태가 되어 게시판을 볼 수 없습니다.`
    if (!window.confirm(message)) return
    setBusyUid(target.uid)
    try {
      await data.setUserRole(target.uid, role)
      await load()
    } catch (err) {
      window.alert(errorMessage(err))
    } finally {
      setBusyUid(null)
    }
  }

  if (loading && !groups) return <Loading />
  if (error && !groups) return <ErrorState message={error} onRetry={load} />
  if (!groups) return null

  return (
    <div>
      <PageHeader
        title="회원 관리"
        description='처음 로그인한 사람은 "승인 대기"에 나타납니다. 연구실 구성원이 맞으면 승인해 주세요.'
        crumbs={[{ label: '회원 관리' }]}
      />
      <ReadOnlyNotice what="회원 권한을 변경" />

      {error && (
        <div className="mt-4">
          <ErrorState message={error} onRetry={load} />
        </div>
      )}

      <UserGroup title="승인 대기" users={groups.pending} empty="승인을 기다리는 사람이 없습니다.">
        {(u) => (
          <ActionButton busy={busyUid === u.uid} onClick={() => changeRole(u, 'member')} primary>
            승인
          </ActionButton>
        )}
      </UserGroup>

      <UserGroup title="회원" users={groups.member} empty="아직 승인된 회원이 없습니다.">
        {(u) => (
          <ActionButton busy={busyUid === u.uid} onClick={() => changeRole(u, 'pending')}>
            권한 해제
          </ActionButton>
        )}
      </UserGroup>

      <UserGroup title="관리자" users={groups.admin} empty="관리자가 없습니다.">
        {(u) => <span className="text-xs text-stone-400">{u.uid === me?.uid ? '나' : '관리자'}</span>}
      </UserGroup>
      <p className="mt-3 text-xs text-stone-500">관리자 권한은 Firebase 콘솔에서만 바꿀 수 있습니다. (README 10단계 참고)</p>
    </div>
  )
}

function UserGroup({
  title,
  users,
  empty,
  children,
}: {
  title: string
  users: AppUser[]
  empty: string
  children: (user: AppUser) => React.ReactNode
}) {
  return (
    <section className="mt-8">
      <h2 className="border-l-4 border-brand-700 pl-3 text-lg font-bold text-brand-800">
        {title} <span className="text-sm font-normal text-stone-500">{users.length}명</span>
      </h2>
      <div className="mt-3">
        {users.length === 0 ? (
          <EmptyState title={empty} />
        ) : (
          <ul className="divide-y divide-stone-200 border-t-2 border-brand-800 border-b border-b-stone-200 bg-white">
            {users.map((u) => (
              <li key={u.uid} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <Avatar name={u.displayName} photoURL={u.photoURL} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-stone-800">{u.displayName}</div>
                  <div className="truncate text-xs text-stone-500">
                    {u.email} · 가입 {formatDate(u.createdAt)}
                  </div>
                </div>
                {children(u)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function ActionButton({ busy, onClick, primary, children }: { busy: boolean; onClick: () => void; primary?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || data.readOnly}
      className={`rounded-sm px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
        primary ? 'bg-brand-700 text-white hover:bg-brand-800' : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
      }`}
    >
      {busy ? '처리 중…' : children}
    </button>
  )
}

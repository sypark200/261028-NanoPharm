import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { ErrorState, Loading } from './States'

/**
 * member 이상만 볼 수 있는 화면을 감쌉니다.
 * - 로그인 안 함 → 로그인 화면으로
 * - 승인 대기(pending) → 승인 대기 안내 화면으로
 * - adminOnly인데 admin이 아님 → 권한 없음 안내
 */
export function RequireRole({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { loading, user, isMember, isAdmin, error } = useAuth()
  const location = useLocation()

  if (loading) return <Loading label="로그인 정보를 확인하는 중입니다…" />
  if (error) return <ErrorState message={error} />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (!isMember) return <Navigate to="/pending" replace />
  if (adminOnly && !isAdmin) {
    return <ErrorState message="이 화면은 관리자(교수)만 이용할 수 있습니다." />
  }
  return <>{children}</>
}

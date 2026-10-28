import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { data, errorMessage } from '../lib/data'
import type { AppUser, Author, Role } from '../types'

interface AuthState {
  /** 로그인 정보와 회원 문서를 확인하는 중이면 true */
  loading: boolean
  /** 로그인하지 않았으면 null */
  user: AppUser | null
  role: Role | null
  isAdmin: boolean
  /** member 또는 admin */
  isMember: boolean
  /** 회원 문서를 읽거나 만들다가 생긴 오류 */
  error: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  /** 글·댓글 작성자 정보 */
  author: Author | null
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<AppUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const unsubscribe = data.onAuthChange(async (authUser) => {
      if (!authUser) {
        if (active) {
          setUser(null)
          setError(null)
          setLoading(false)
        }
        return
      }
      setLoading(true)
      try {
        const profile = await data.ensureUserProfile(authUser)
        if (active) {
          setUser(profile)
          setError(null)
        }
      } catch (err) {
        if (active) {
          setUser(null)
          setError(errorMessage(err))
        }
      } finally {
        if (active) setLoading(false)
      }
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const signIn = useCallback(() => data.signInWithGoogle(), [])
  const signOut = useCallback(() => data.signOut(), [])

  const value = useMemo<AuthState>(() => {
    const role = user?.role ?? null
    return {
      loading,
      user,
      role,
      isAdmin: role === 'admin',
      isMember: role === 'admin' || role === 'member',
      error,
      signIn,
      signOut,
      author: user ? { uid: user.uid, name: user.displayName } : null,
    }
  }, [loading, user, error, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  return ctx
}

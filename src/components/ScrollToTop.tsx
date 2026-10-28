import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** 페이지를 옮길 때 화면을 맨 위로 올립니다 */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

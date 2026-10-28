import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PostCard } from '../components/PostCard'
import { EmptyState, ErrorState, Loading } from '../components/States'
import { lab } from '../content/lab'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES } from '../lib/categories'
import { data, errorMessage, type PageCursor } from '../lib/data'
import type { Category, Post } from '../types'

export function PostListPage({ category }: { category: Category }) {
  const info = CATEGORIES[category]
  const { isAdmin } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = searchParams.get('tag')

  const [posts, setPosts] = useState<Post[]>([])
  const [cursor, setCursor] = useState<PageCursor | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFirst = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const page = await data.listPosts({ category, tag })
      setPosts(page.items)
      setCursor(page.nextCursor)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [category, tag])

  useEffect(() => {
    void loadFirst()
  }, [loadFirst])

  const loadMore = async () => {
    if (cursor == null) return
    setLoadingMore(true)
    setError(null)
    try {
      const page = await data.listPosts({ category, tag, cursor })
      setPosts((prev) => [...prev, ...page.items])
      setCursor(page.nextCursor)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoadingMore(false)
    }
  }

  const setTag = (next: string | null) => {
    setSearchParams(next ? { tag: next } : {})
  }

  const canWrite = isAdmin || info.memberCanWrite
  // 수업자료는 lab.ts의 과목 목록을, 다른 게시판은 지금 선택된 태그만 필터 칩으로 보여줍니다
  const filterTags = category === 'lecture' ? lab.courses : tag ? [tag] : []

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 sm:text-3xl">{info.label}</h1>
          <p className="mt-1 text-sm text-stone-600">{info.description}</p>
        </div>
        {canWrite && (
          <Link
            to={`/posts/new?category=${category}`}
            className="rounded bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            새 글 쓰기
          </Link>
        )}
      </div>

      {filterTags.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm" role="group" aria-label={category === 'lecture' ? '과목 필터' : '태그 필터'}>
          <span className="mr-1 text-stone-500">{category === 'lecture' ? '과목' : '태그'}</span>
          <FilterChip active={!tag} onClick={() => setTag(null)}>
            전체
          </FilterChip>
          {filterTags.map((t) => (
            <FilterChip key={t} active={tag === t} onClick={() => setTag(t)}>
              {t}
            </FilterChip>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          <Loading />
        ) : error && posts.length === 0 ? (
          <ErrorState message={error} onRetry={loadFirst} />
        ) : posts.length === 0 ? (
          <EmptyState title={tag ? `'${tag}' 태그가 붙은 글이 없습니다.` : '아직 등록된 글이 없습니다.'}>
            {canWrite && '오른쪽 위의 "새 글 쓰기" 버튼으로 첫 글을 올려 보세요.'}
          </EmptyState>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onTagClick={setTag} />
            ))}
            {error && <ErrorState message={error} />}
            {cursor != null && (
              <div className="pt-3 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded border border-stone-300 bg-white px-5 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                >
                  {loadingMore ? '불러오는 중…' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 transition-colors ${
        active ? 'border-brand-700 bg-brand-700 text-white' : 'border-stone-300 bg-white text-stone-700 hover:border-brand-600'
      }`}
    >
      {children}
    </button>
  )
}

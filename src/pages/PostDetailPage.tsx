import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { CommentSection } from '../components/CommentSection'
import { Markdown } from '../components/Markdown'
import { ErrorState, Loading } from '../components/States'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, postPath } from '../lib/categories'
import { data, errorMessage } from '../lib/data'
import { formatDate, formatDateTime, isSafeUrl } from '../lib/format'
import type { Category, Post } from '../types'
import { NotFoundPage } from './NotFoundPage'

export function PostDetailPage({ category }: { category: Category }) {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPost(await data.getPost(id))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!post) return <NotFoundPage />
  // 다른 게시판 주소로 들어온 경우 올바른 주소로 이동
  if (post.category !== category) return <Navigate to={postPath(post.category, post.id)} replace />

  const info = CATEGORIES[post.category]
  const canModify = !data.readOnly && (isAdmin || user?.uid === post.authorUid)
  const edited = post.updatedAt && post.createdAt && post.updatedAt.getTime() - post.createdAt.getTime() > 60_000

  const handleDelete = async () => {
    if (!window.confirm(`"${post.title}" 글을 삭제할까요?\n댓글도 함께 삭제되며 되돌릴 수 없습니다.`)) return
    setDeleting(true)
    try {
      await data.deletePost(post.id)
      navigate(info.path, { replace: true })
    } catch (err) {
      window.alert(errorMessage(err))
      setDeleting(false)
    }
  }

  return (
    <article>
      <Link to={info.path} className="text-sm text-brand-600 hover:underline">
        ← {info.label} 목록
      </Link>

      <header className="mt-4 border-b border-stone-200 pb-5">
        <h1 className="font-serif text-2xl font-bold leading-snug text-stone-900 sm:text-3xl">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
          <span className="font-medium text-stone-700">{post.authorName}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.createdAt)}</span>
          {edited && <span className="text-xs">(수정됨 {formatDateTime(post.updatedAt)})</span>}
          <span aria-hidden>·</span>
          <span>댓글 {post.commentCount}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`${info.path}?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600 hover:bg-brand-50 hover:text-brand-700"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        {canModify && (
          <div className="mt-4 flex gap-2">
            <Link to={`/posts/${post.id}/edit`} className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50">
              수정
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? '삭제 중…' : '삭제'}
            </button>
          </div>
        )}
      </header>

      <div className="mt-6">
        {post.body.trim() ? <Markdown>{post.body}</Markdown> : <p className="text-stone-500">본문이 없습니다.</p>}
      </div>

      {post.links.length > 0 && (
        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-stone-700">첨부 링크</h2>
          <ul className="mt-3 space-y-2">
            {post.links.map((link, i) => (
              <li key={i} className="text-sm">
                {isSafeUrl(link.url) ? (
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="break-all text-brand-600 hover:underline">
                    📎 {link.label || link.url}
                  </a>
                ) : (
                  <span className="text-stone-500">📎 {link.label} (올바르지 않은 주소)</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <CommentSection
        postId={post.id}
        onCountChange={(delta) => setPost((p) => (p ? { ...p, commentCount: Math.max(0, p.commentCount + delta) } : p))}
      />
    </article>
  )
}

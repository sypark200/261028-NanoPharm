import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { data, errorMessage, type PageCursor } from '../lib/data'
import { formatDateTime } from '../lib/format'
import type { Comment } from '../types'
import { ReadOnlyNotice } from './ReadOnlyNotice'
import { EmptyState, ErrorState, Loading } from './States'

const MAX_COMMENT = 5000

export function CommentSection({ postId, onCountChange }: { postId: string; onCountChange: (delta: number) => void }) {
  const { user, isAdmin, author } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [cursor, setCursor] = useState<PageCursor | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const loadFirst = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const page = await data.listComments(postId)
      setComments(page.items)
      setCursor(page.nextCursor)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    void loadFirst()
  }, [loadFirst])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const page = await data.listComments(postId, cursor)
      setComments((prev) => [...prev, ...page.items])
      setCursor(page.nextCursor)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoadingMore(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body || !author) return
    setSubmitting(true)
    setFormError(null)
    try {
      await data.addComment(postId, body, author)
      setDraft('')
      onCountChange(1)
      // 내 댓글이 목록 끝에 보이도록 다시 불러옵니다 (다음 페이지가 남아 있으면 마지막 페이지가 아닐 수 있음)
      if (cursor == null) await loadFirst()
    } catch (err) {
      setFormError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const saveEdit = async (comment: Comment) => {
    const body = editText.trim()
    if (!body) return
    try {
      await data.updateComment(postId, comment.id, body)
      setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, body } : c)))
      setEditingId(null)
    } catch (err) {
      window.alert(errorMessage(err))
    }
  }

  const remove = async (comment: Comment) => {
    if (!window.confirm('이 댓글을 삭제할까요? 삭제한 댓글은 되돌릴 수 없습니다.')) return
    try {
      await data.deleteComment(postId, comment.id)
      setComments((prev) => prev.filter((c) => c.id !== comment.id))
      onCountChange(-1)
    } catch (err) {
      window.alert(errorMessage(err))
    }
  }

  return (
    <section className="mt-10 border-t border-stone-200 pt-8" aria-label="댓글">
      <h2 className="border-l-4 border-brand-700 pl-3 text-lg font-bold text-brand-800">댓글</h2>

      <div className="mt-4 space-y-3">
        {loading ? (
          <Loading label="댓글을 불러오는 중입니다…" />
        ) : error && comments.length === 0 ? (
          <ErrorState message={error} onRetry={loadFirst} />
        ) : comments.length === 0 ? (
          <EmptyState title="아직 댓글이 없습니다.">첫 댓글을 남겨 보세요.</EmptyState>
        ) : (
          comments.map((c) => {
            const mine = user?.uid === c.authorUid
            const canModify = !data.readOnly && (mine || isAdmin)
            return (
              <div key={c.id} className="rounded-sm border border-stone-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                  <span>
                    <span className="font-medium text-stone-700">{c.authorName}</span> · {formatDateTime(c.createdAt)}
                  </span>
                  {canModify && editingId !== c.id && (
                    <span className="flex gap-2">
                      {mine && (
                        <button
                          type="button"
                          className="hover:text-brand-700"
                          onClick={() => {
                            setEditingId(c.id)
                            setEditText(c.body)
                          }}
                        >
                          수정
                        </button>
                      )}
                      <button type="button" className="hover:text-red-700" onClick={() => remove(c)}>
                        삭제
                      </button>
                    </span>
                  )}
                </div>
                {editingId === c.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      maxLength={MAX_COMMENT}
                      rows={3}
                      className="w-full rounded-sm border border-stone-300 p-2 text-sm focus:border-brand-600 focus:outline-none"
                    />
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => saveEdit(c)} className="rounded-sm bg-brand-700 px-3 py-1 text-xs text-white hover:bg-brand-800">
                        저장
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-sm border border-stone-300 px-3 py-1 text-xs text-stone-600">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-800">{c.body}</p>
                )}
              </div>
            )
          })
        )}
        {error && comments.length > 0 && <ErrorState message={error} />}
        {cursor != null && (
          <div className="text-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-sm border border-stone-300 bg-white px-4 py-1.5 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {loadingMore ? '불러오는 중…' : '댓글 더 보기'}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="mt-6">
        <label htmlFor="comment" className="sr-only">
          댓글 쓰기
        </label>
        <textarea
          id="comment"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_COMMENT}
          rows={3}
          disabled={data.readOnly}
          placeholder="댓글을 입력하세요"
          className="w-full rounded-sm border border-stone-300 bg-white p-3 text-sm focus:border-brand-600 focus:outline-none disabled:bg-stone-100"
        />
        {formError && <div className="mt-2"><ErrorState message={formError} /></div>}
        <div className="mt-2 flex items-center justify-between gap-3">
          <ReadOnlyNotice what="댓글을 작성" />
          <button
            type="submit"
            disabled={data.readOnly || submitting || !draft.trim()}
            className="ml-auto rounded-sm bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? '등록 중…' : '댓글 등록'}
          </button>
        </div>
      </form>
    </section>
  )
}

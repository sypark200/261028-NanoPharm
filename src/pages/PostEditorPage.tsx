import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { Markdown } from '../components/Markdown'
import { ReadOnlyNotice } from '../components/ReadOnlyNotice'
import { ErrorState, Loading } from '../components/States'
import { useAuth } from '../hooks/useAuth'
import { CATEGORIES, CATEGORY_ORDER, isCategory, postPath } from '../lib/categories'
import { data, errorMessage } from '../lib/data'
import { isSafeUrl } from '../lib/format'
import type { Category, PostLink } from '../types'

const MAX_TITLE = 200
const MAX_TAGS = 10
const MAX_LINKS = 20

function parseTags(text: string): string[] {
  const tags = text
    .split(',')
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean)
  return Array.from(new Set(tags))
}

export function PostEditorPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAdmin, author } = useAuth()

  const initialCategory = searchParams.get('category')
  const [category, setCategory] = useState<Category>(
    isCategory(initialCategory) && (isAdmin || CATEGORIES[initialCategory].memberCanWrite) ? initialCategory : 'discussion',
  )
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tagText, setTagText] = useState('')
  const [links, setLinks] = useState<PostLink[]>([])
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [forbidden, setForbidden] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    data
      .getPost(id)
      .then((post) => {
        if (!active) return
        if (!post) {
          setLoadError('글을 찾을 수 없습니다. 삭제되었을 수 있습니다.')
          return
        }
        if (!isAdmin && post.authorUid !== user?.uid && !data.readOnly) {
          setForbidden(true)
          return
        }
        setCategory(post.category)
        setTitle(post.title)
        setBody(post.body)
        setTagText(post.tags.join(', '))
        setLinks(post.links)
      })
      .catch((err) => active && setLoadError(errorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, isAdmin, user?.uid])

  if (loading) return <Loading />
  if (loadError) return <ErrorState message={loadError} />
  if (forbidden) return <ErrorState message="본인이 쓴 글만 수정할 수 있습니다." />

  const allowedCategories = CATEGORY_ORDER.filter((c) => isAdmin || CATEGORIES[c].memberCanWrite)

  const updateLink = (index: number, patch: Partial<PostLink>) =>
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const tags = parseTags(tagText)
    const cleanLinks = links
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      .filter((l) => l.label || l.url)

    if (!title.trim()) return setFormError('제목을 입력해 주세요.')
    if (tags.length > MAX_TAGS) return setFormError(`태그는 최대 ${MAX_TAGS}개까지 입력할 수 있습니다.`)
    const badLink = cleanLinks.find((l) => !isSafeUrl(l.url))
    if (badLink) return setFormError(`링크 주소는 http:// 또는 https:// 로 시작해야 합니다: ${badLink.label || badLink.url || '(빈 주소)'}`)
    if (!author) return setFormError('로그인 정보가 없습니다. 다시 로그인해 주세요.')

    const input = {
      category,
      title: title.trim(),
      body,
      tags,
      links: cleanLinks.map((l) => ({ label: l.label || l.url, url: l.url })),
    }
    setSaving(true)
    try {
      if (id) {
        await data.updatePost(id, input)
        navigate(postPath(category, id), { replace: true })
      } else {
        const newId = await data.createPost(input, author)
        navigate(postPath(category, newId), { replace: true })
      }
    } catch (err) {
      setFormError(errorMessage(err))
      setSaving(false)
    }
  }

  const inputClass = 'w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none'

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-stone-900">{isEdit ? '글 수정' : '새 글 쓰기'}</h1>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-stone-700">
              제목
            </label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={MAX_TITLE} className={inputClass} placeholder="제목을 입력하세요" />
          </div>
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-stone-700">
              게시판
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              disabled={isEdit && !isAdmin}
              className={inputClass}
            >
              {allowedCategories.map((c) => (
                <option key={c} value={c}>
                  {CATEGORIES[c].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium text-stone-700">
            태그 <span className="font-normal text-stone-500">(쉼표로 구분{category === 'lecture' ? ', 과목명을 넣으면 과목 필터에 표시됩니다' : ''})</span>
          </label>
          <input id="tags" value={tagText} onChange={(e) => setTagText(e.target.value)} className={inputClass} placeholder="예: 약제학, 3주차" />
        </div>

        <div>
          <div className="mb-1 flex items-end justify-between">
            <span className="text-sm font-medium text-stone-700">본문 (마크다운)</span>
            <div className="flex rounded border border-stone-300 text-sm" role="tablist">
              {(['write', 'preview'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1 ${tab === t ? 'bg-brand-700 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'}`}
                >
                  {t === 'write' ? '작성' : '미리보기'}
                </button>
              ))}
            </div>
          </div>
          {tab === 'write' ? (
            <>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={16}
                className={`${inputClass} font-mono leading-relaxed`}
                placeholder={'## 소제목\n\n본문을 입력하세요. **굵게**, *기울임*, - 목록, [링크](https://...) 를 쓸 수 있습니다.'}
                aria-label="본문"
              />
              <p className="mt-1 text-xs text-stone-500">마크다운 문법: # 제목, **굵게**, - 목록, 1. 번호 목록, | 표 |, &gt; 인용</p>
            </>
          ) : (
            <div className="min-h-64 rounded border border-stone-300 bg-white p-4">
              {body.trim() ? <Markdown>{body}</Markdown> : <p className="text-sm text-stone-400">미리 볼 내용이 없습니다.</p>}
            </div>
          )}
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-stone-700">
            첨부 링크 <span className="font-normal text-stone-500">(Google Drive, OneDrive 등의 공유 링크)</span>
          </span>
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={link.label}
                  onChange={(e) => updateLink(i, { label: e.target.value })}
                  className={`${inputClass} sm:w-56`}
                  placeholder="이름 (예: 강의 슬라이드)"
                  aria-label={`링크 ${i + 1} 이름`}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(i, { url: e.target.value })}
                  className={inputClass}
                  placeholder="https://drive.google.com/..."
                  aria-label={`링크 ${i + 1} 주소`}
                  inputMode="url"
                />
                <button
                  type="button"
                  onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))}
                  className="shrink-0 rounded border border-stone-300 px-3 py-2 text-sm text-stone-600 hover:bg-red-50 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
          {links.length < MAX_LINKS && (
            <button
              type="button"
              onClick={() => setLinks((prev) => [...prev, { label: '', url: '' }])}
              className="mt-2 rounded border border-dashed border-stone-400 px-3 py-1.5 text-sm text-stone-600 hover:border-brand-600 hover:text-brand-700"
            >
              + 링크 추가
            </button>
          )}
        </div>

        {formError && <ErrorState message={formError} />}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-stone-200 pt-5">
          <ReadOnlyNotice />
          <Link to={id ? postPath(category, id) : CATEGORIES[category].path} className="rounded border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50">
            취소
          </Link>
          <button
            type="submit"
            disabled={saving || data.readOnly}
            className="rounded bg-brand-700 px-5 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? '저장 중…' : isEdit ? '수정 완료' : '등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

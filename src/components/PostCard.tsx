import { Link } from 'react-router'
import { postPath } from '../lib/categories'
import { formatDate } from '../lib/format'
import type { Post } from '../types'

/** 본문 마크다운에서 기호를 걷어낸 짧은 미리보기 */
function excerpt(body: string, max = 120) {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max)}…` : text
}

export function PostCard({ post, onTagClick }: { post: Post; onTagClick?: (tag: string) => void }) {
  return (
    <article className="border-b border-stone-200 px-4 py-4 transition-colors hover:bg-brand-50/50 sm:px-5">
      <Link to={postPath(post.category, post.id)} className="group block">
        <h2 className="text-[17px] font-bold text-stone-900 group-hover:text-brand-700 group-hover:underline">{post.title}</h2>
        {post.body && <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{excerpt(post.body)}</p>}
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-stone-500">
        <span className="font-medium text-stone-700">{post.authorName}</span>
        <span aria-hidden>·</span>
        <span>{formatDate(post.createdAt)}</span>
        <span aria-hidden>·</span>
        <span>댓글 {post.commentCount}</span>
        {post.links.length > 0 && (
          <>
            <span aria-hidden>·</span>
            <span>첨부 {post.links.length}</span>
          </>
        )}
        {post.tags.length > 0 && (
          <span className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                className="rounded-sm border border-stone-200 px-1.5 py-0.5 text-stone-600 hover:border-brand-600 hover:text-brand-700"
              >
                #{tag}
              </button>
            ))}
          </span>
        )}
      </div>
    </article>
  )
}

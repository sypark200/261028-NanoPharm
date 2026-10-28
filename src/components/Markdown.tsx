import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** 마크다운 본문 표시. 원시 HTML은 표시하지 않습니다(skipHtml). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-stone max-w-none prose-headings:font-serif prose-a:text-brand-600 prose-table:text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

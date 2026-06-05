import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownResult({ content }) {
  if (!content) {
    return (
      <div className="empty-state">
        Ask Ollama. Markdown show here.
      </div>
    )
  }

  return (
    <article className="markdown-result">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  )
}

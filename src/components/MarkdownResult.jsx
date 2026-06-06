import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock.jsx'

export default function MarkdownResult({ content }) {
  if (!content) {
    return (
      <div className="empty-state">
        Ask Ollama a question to see the answer here.
      </div>
    )
  }

  return (
    <article className="markdown-result">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return children
          },
          code({ inline, className, children }) {
            if (inline) {
              return <code className={className}>{children}</code>
            }

            return <CodeBlock className={className}>{children}</CodeBlock>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}

import MarkdownResult from './MarkdownResult.jsx'

function formatSize(size) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }

  return `${Math.round(size / 1024 / 1024)} MB`
}

export default function ChatMessages({ messages, loading }) {
  if (messages.length === 0) {
    return (
      <section className="messages empty-chat">
        
      </section>
    )
  }

  return (
    <section className="messages" aria-live="polite">
      {messages.map(message => (
        <article className={`message ${message.role}`} key={message.id}>
          <div className="message-label">
            {message.role === 'user' ? 'You' : 'Ollama'}
          </div>
          {message.role === 'assistant' ? (
            <MarkdownResult content={message.content || (loading ? 'Thinking...' : '')} />
          ) : (
            <>
              <p>{message.content}</p>
              {message.attachments?.length > 0 && (
                <div className="message-attachments">
                  {message.attachments.map(attachment => (
                    <span key={attachment.id}>
                      {attachment.name} ({formatSize(attachment.size)})
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </article>
      ))}
    </section>
  )
}

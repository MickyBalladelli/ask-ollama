import MarkdownResult from './MarkdownResult.jsx'

export default function ChatMessages({ messages, loading }) {
  if (messages.length === 0) {
    return (
      <section className="messages empty-chat">
        Ask Ollama. Chat stay here.
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
            <p>{message.content}</p>
          )}
        </article>
      ))}
    </section>
  )
}

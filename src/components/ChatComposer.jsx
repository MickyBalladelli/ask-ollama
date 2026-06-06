export default function ChatComposer({ value, loading, disabled, onChange, onSubmit }) {
  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSubmit(event)
    }
  }

  return (
    <form className="chat-composer" onSubmit={onSubmit}>
      <textarea
        aria-label="Message"
        value={value}
        onChange={event => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows="2"
        placeholder="Ask Ollama..."
      />

      <button type="submit" disabled={disabled || loading || !value.trim()}>
        {loading ? 'Wait' : 'Send'}
      </button>
    </form>
  )
}

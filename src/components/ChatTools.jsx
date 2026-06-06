export default function ChatTools({
  search,
  systemPrompt,
  onSearchChange,
  onSystemPromptChange,
  onExport,
  onClear,
  hasMessages
}) {
  return (
    <div className="chat-tools">
      <input
        aria-label="Search chat"
        value={search}
        onChange={event => onSearchChange(event.target.value)}
        placeholder="Search chat"
      />

      <input
        aria-label="System prompt"
        value={systemPrompt}
        onChange={event => onSystemPromptChange(event.target.value)}
        placeholder="System prompt"
      />

      <button type="button" className="secondary-button" disabled={!hasMessages} onClick={onExport}>
        Export
      </button>

      <button type="button" className="secondary-button" disabled={!hasMessages} onClick={onClear}>
        Clear
      </button>
    </div>
  )
}

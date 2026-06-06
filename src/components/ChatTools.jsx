export default function ChatTools({
  search,
  systemPrompt,
  searchCount,
  searchIndex,
  settingsOpen,
  status,
  onSearchChange,
  onSystemPromptChange,
  onSearchNext,
  onSearchPrevious,
  onExport,
  onClear,
  onToggleSettings,
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

      {search.trim() && <span className="search-count">{searchCount} found</span>}

      {search.trim() && (
        <div className="search-buttons">
          <button type="button" className="secondary-button" disabled={searchCount === 0} onClick={onSearchPrevious}>
            Prev
          </button>
          <button type="button" className="secondary-button" disabled={searchCount === 0} onClick={onSearchNext}>
            Next
          </button>
          {searchCount > 0 && <span>{searchIndex + 1}/{searchCount}</span>}
        </div>
      )}

      <input
        aria-label="System prompt"
        value={systemPrompt}
        onChange={event => onSystemPromptChange(event.target.value)}
        placeholder="System prompt"
      />

      <button type="button" className="secondary-button chat-tool-button" disabled={!hasMessages} onClick={onExport}>
        Export
      </button>

      <button type="button" className="secondary-button chat-tool-button" disabled={!hasMessages} onClick={onClear}>
        Clear
      </button>

      <button type="button" className="secondary-button chat-tool-button" onClick={onToggleSettings}>
        {settingsOpen ? 'Hide' : 'Settings'}
      </button>

      {status && <span className="status-text">{status}</span>}
    </div>
  )
}

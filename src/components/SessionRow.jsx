export default function SessionRow({
  session,
  active,
  onSelect,
  onRename,
  onPin,
  onDelete
}) {
  return (
    <div className="session-row">
      <button
        type="button"
        className={active ? 'session-button active' : 'session-button'}
        onClick={() => onSelect(session.id)}
      >
        {session.pinned ? 'Pinned ' : ''}{session.title}
      </button>

      <button
        type="button"
        className="delete-session-button"
        onClick={() => onPin(session.id)}
        aria-label={`${session.pinned ? 'Unpin' : 'Pin'} ${session.title}`}
      >
        {session.pinned ? 'Unpin' : 'Pin'}
      </button>

      <button
        type="button"
        className="delete-session-button"
        onClick={() => onRename(session.id)}
        aria-label={`Rename ${session.title}`}
      >
        Rename
      </button>

      <button
        type="button"
        className="delete-session-button"
        onClick={() => onDelete(session.id)}
        aria-label={`Delete ${session.title}`}
      >
        Delete
      </button>
    </div>
  )
}

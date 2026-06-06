function formatSize(size) {
  if (size < 1024) {
    return `${size} B`
  }

  return `${Math.round(size / 1024)} KB`
}

export default function AttachmentList({ attachments, onRemove }) {
  if (attachments.length === 0) {
    return null
  }

  return (
    <div className="attachment-list">
      {attachments.map(attachment => (
        <div className="attachment-pill" key={attachment.id}>
          <span>{attachment.name}</span>
          <small>{formatSize(attachment.size)}</small>
          <button type="button" onClick={() => onRemove(attachment.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

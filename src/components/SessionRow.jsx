import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { IconButton, Tooltip } from '@mui/material'

export default function SessionRow({
  session,
  active,
  onSelect,
  onRename,
  onPin,
  onDelete
}) {
  return (
    <div className={`session-row${active ? ' active' : ''}${session.pinned ? ' pinned' : ''}`}>
      <button
        type="button"
        className="session-button"
        onClick={() => onSelect(session.id)}
      >
        <span>{session.title}</span>
      </button>

      <div className="session-actions">
        <Tooltip title={session.pinned ? 'Unpin chat' : 'Pin chat'}>
          <IconButton color="primary" onClick={() => onPin(session.id)} aria-label={`${session.pinned ? 'Unpin' : 'Pin'} ${session.title}`}>
            {session.pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Rename chat">
          <IconButton color="primary" onClick={() => onRename(session.id)} aria-label={`Rename ${session.title}`}>
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete chat">
          <IconButton color="error" onClick={() => onDelete(session.id)} aria-label={`Delete ${session.title}`}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

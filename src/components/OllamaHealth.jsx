import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import SyncIcon from '@mui/icons-material/Sync'
import { Chip, Tooltip } from '@mui/material'

export default function OllamaHealth({ status }) {
  const health = {
    checking: {
      label: 'Checking',
      color: 'default',
      icon: <SyncIcon />
    },
    online: {
      label: 'Ollama on',
      color: 'success',
      icon: <CheckCircleIcon />
    },
    offline: {
      label: 'Ollama off',
      color: 'error',
      icon: <ErrorIcon />
    }
  }[status] ?? {
    label: 'Unknown',
    color: 'default',
    icon: <SyncIcon />
  }

  return (
    <Tooltip title="Ollama health">
      <Chip className="health-chip" size="small" color={health.color} icon={health.icon} label={health.label} />
    </Tooltip>
  )
}

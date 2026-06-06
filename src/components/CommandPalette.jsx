import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItemButton, ListItemText, TextField, Tooltip } from '@mui/material'
import { useMemo, useState } from 'react'

export default function CommandPalette({ open, onClose, actions }) {
  const [query, setQuery] = useState('')
  const visibleActions = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()

    if (!cleanQuery) {
      return actions
    }

    return actions.filter(action => action.label.toLowerCase().includes(cleanQuery))
  }, [actions, query])

  function runAction(action) {
    action.run()
    setQuery('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="dialog-title">
        Command palette
        <Tooltip title="Close">
          <IconButton onClick={onClose} aria-label="Close command palette">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          autoFocus
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Type command"
        />
        <List>
          {visibleActions.map(action => (
            <ListItemButton key={action.label} onClick={() => runAction(action)}>
              <ListItemText primary={action.label} secondary={action.description} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}

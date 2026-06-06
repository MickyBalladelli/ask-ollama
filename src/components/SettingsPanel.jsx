import { useRef } from 'react'

export default function SettingsPanel({
  open,
  models,
  settings,
  onSettingsChange,
  onExportAll,
  onImportAll
}) {
  const inputRef = useRef(null)

  if (!open) {
    return null
  }

  return (
    <div className="settings-panel">
      <label>
        Theme
        <select
          value={settings.theme}
          onChange={event => onSettingsChange({ ...settings, theme: event.target.value })}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>

      <label>
        Font size
        <select
          value={settings.fontSize}
          onChange={event => onSettingsChange({ ...settings, fontSize: event.target.value })}
        >
          <option value="small">Small</option>
          <option value="normal">Normal</option>
          <option value="large">Large</option>
        </select>
      </label>

      <label>
        Default model
        <select
          value={settings.defaultModel}
          onChange={event => onSettingsChange({ ...settings, defaultModel: event.target.value })}
        >
          <option value="">First installed</option>
          {models.map(model => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))}
        </select>
      </label>

      <div className="settings-actions">
        <button type="button" className="secondary-button" onClick={onExportAll}>
          Backup
        </button>
        <button type="button" className="secondary-button" onClick={() => inputRef.current?.click()}>
          Import
        </button>
      </div>

      <input
        ref={inputRef}
        className="file-input"
        type="file"
        accept="application/json"
        onChange={event => {
          const file = event.target.files?.[0]

          if (file) {
            onImportAll(file)
          }

          event.target.value = ''
        }}
      />
    </div>
  )
}

export default function ModelSelect({ models, value, loading, onChange, onRefresh }) {
  return (
    <label>
      Model
      <div className="model-row">
        <select
          value={value}
          onChange={event => onChange(event.target.value)}
          disabled={loading || models.length === 0}
        >
          {models.length === 0 && <option value="">No models found</option>}
          {models.map(model => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))}
        </select>

        <button
          className="secondary-button"
          type="button"
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
    </label>
  )
}

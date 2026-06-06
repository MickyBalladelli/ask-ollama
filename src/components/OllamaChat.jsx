import { useEffect, useState } from 'react'
import MarkdownResult from './MarkdownResult.jsx'
import ModelSelect from './ModelSelect.jsx'
import { generateOllamaAnswer, getOllamaModels } from '../lib/ollamaApi.js'

const defaultPrompt = 'Write a short markdown note about why local LLMs are useful.'

export default function OllamaChat() {
  const [models, setModels] = useState([])
  const [model, setModel] = useState('')
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelsLoading, setModelsLoading] = useState(false)

  async function loadModels() {
    setModelsLoading(true)
    setError('')

    try {
      const data = await getOllamaModels()
      const installedModels = data.models ?? []

      setModels(installedModels)
      setModel(current => {
        if (installedModels.some(installedModel => installedModel.name === current)) {
          return current
        }

        return installedModels[0]?.name ?? ''
      })
    } catch (err) {
      setModels([])
      setModel('')
      setError(err.message || 'Could not load Ollama models')
    } finally {
      setModelsLoading(false)
    }
  }

  useEffect(() => {
    loadModels()
  }, [])

  async function askOllama(event) {
    event.preventDefault()

    if (!prompt.trim() || !model || loading) {
      return
    }

    setAnswer('')
    setError('')
    setLoading(true)

    try {
      await generateOllamaAnswer({
        model,
        prompt,
        onChunk: chunk => setAnswer(current => current + chunk)
      })
    } catch (err) {
      setError(err.message || 'Ollama request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="query-panel">
        <div>
          <p className="eyebrow">Ollama Markdown</p>
          <h1>Ask Ollama</h1>
        </div>

        <form onSubmit={askOllama} className="query-form">
          <ModelSelect
            models={models}
            value={model}
            loading={modelsLoading}
            onChange={setModel}
            onRefresh={loadModels}
          />

          <label>
            Prompt
            <textarea
              value={prompt}
              onChange={event => setPrompt(event.target.value)}
              rows="7"
            />
          </label>

          <button type="submit" disabled={loading || modelsLoading || !model}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="result-panel" aria-live="polite">
        <MarkdownResult content={answer} />
      </section>
    </main>
  )
}

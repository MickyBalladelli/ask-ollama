import { useEffect, useState } from 'react'
import MarkdownResult from './MarkdownResult.jsx'
import ModelSelect from './ModelSelect.jsx'

const defaultPrompt = 'Write a short markdown note about why local LLMs are useful.'

const defaultApiBaseUrl = window.location.protocol === 'file:' ? 'http://localhost:11434' : '/api/ollama'
const apiBaseUrl = (import.meta.env.VITE_OLLAMA_API_BASE_URL || defaultApiBaseUrl).replace(/\/+$/, '')
const apiUrl = path => `${apiBaseUrl}${path}`

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
      const response = await fetch(apiUrl('/api/tags'))

      if (!response.ok) {
        throw new Error(`Ollama models failed ${response.status}`)
      }

      const data = await response.json()
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
      const response = await fetch(apiUrl('/api/generate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`Ollama said ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No stream from Ollama')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) {
            continue
          }

          const data = JSON.parse(line)

          if (data.response) {
            setAnswer(current => current + data.response)
          }

          if (data.done) {
            break
          }
        }
      }
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

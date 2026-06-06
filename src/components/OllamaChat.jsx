import { useEffect, useMemo, useState } from 'react'
import ChatComposer from './ChatComposer.jsx'
import ChatMessages from './ChatMessages.jsx'
import SessionSidebar from './SessionSidebar.jsx'
import { generateOllamaAnswer, getOllamaModels } from '../lib/ollamaApi.js'

const sessionsStorageKey = 'ask-ollama-sessions'

function createSession() {
  return {
    id: crypto.randomUUID(),
    title: 'New chat',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}

function summarizeDiscussion(text) {
  const cleanText = text.trim().replace(/\s+/g, ' ')
  const words = cleanText.split(' ').slice(0, 7).join(' ')

  return words || 'New chat'
}

function buildPrompt(messages) {
  return messages
    .map(message => `${message.role === 'user' ? 'User' : 'Ollama'}: ${message.content}`)
    .join('\n\n')
}

function loadSavedSessions() {
  try {
    const savedSessions = JSON.parse(localStorage.getItem(sessionsStorageKey) || '[]')

    if (Array.isArray(savedSessions) && savedSessions.length > 0) {
      return savedSessions
    }
  } catch {
    return [createSession()]
  }

  return [createSession()]
}

export default function OllamaChat() {
  const [models, setModels] = useState([])
  const [model, setModel] = useState('')
  const [draft, setDraft] = useState('')
  const [sessions, setSessions] = useState(loadSavedSessions)
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0].id)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelsLoading, setModelsLoading] = useState(false)

  const activeSession = useMemo(
    () => sessions.find(session => session.id === activeSessionId) ?? sessions[0],
    [activeSessionId, sessions]
  )

  useEffect(() => {
    localStorage.setItem(sessionsStorageKey, JSON.stringify(sessions))
  }, [sessions])

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

  function updateActiveSession(updater) {
    setSessions(currentSessions => currentSessions.map(session => {
      if (session.id !== activeSession.id) {
        return session
      }

      return updater(session)
    }))
  }

  function startSession() {
    const nextSession = createSession()

    setSessions(currentSessions => [nextSession, ...currentSessions])
    setActiveSessionId(nextSession.id)
    setDraft('')
    setError('')
  }

  function deleteSession(sessionId) {
    setSessions(currentSessions => {
      const nextSessions = currentSessions.filter(session => session.id !== sessionId)
      const fallbackSession = nextSessions[0] ?? createSession()

      if (sessionId === activeSessionId) {
        setActiveSessionId(fallbackSession.id)
      }

      return nextSessions.length > 0 ? nextSessions : [fallbackSession]
    })
    setError('')
  }

  async function askOllama(event) {
    event.preventDefault()

    const trimmedDraft = draft.trim()

    if (!trimmedDraft || !model || loading || !activeSession) {
      return
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedDraft
    }
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: ''
    }
    const messagesForOllama = [...activeSession.messages, userMessage]

    setDraft('')
    setError('')
    setLoading(true)
    updateActiveSession(session => ({
      ...session,
      title: session.messages.length === 0 ? summarizeDiscussion(trimmedDraft) : session.title,
      messages: [...messagesForOllama, assistantMessage],
      updatedAt: Date.now()
    }))

    try {
      await generateOllamaAnswer({
        model,
        prompt: buildPrompt(messagesForOllama),
        onChunk: chunk => {
          setSessions(currentSessions => currentSessions.map(session => {
            if (session.id !== activeSession.id) {
              return session
            }

            return {
              ...session,
              messages: session.messages.map(message => {
                if (message.id !== assistantMessage.id) {
                  return message
                }

                return {
                  ...message,
                  content: message.content + chunk
                }
              }),
              updatedAt: Date.now()
            }
          }))
        }
      })
    } catch (err) {
      setError(err.message || 'Ollama request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSession?.id}
        models={models}
        model={model}
        modelsLoading={modelsLoading}
        onSelectSession={setActiveSessionId}
        onNewSession={startSession}
        onDeleteSession={deleteSession}
        onModelChange={setModel}
        onRefreshModels={loadModels}
      />

      <section className="chat-panel">
        {error && <p className="error-text">{error}</p>}

        <ChatMessages messages={activeSession?.messages ?? []} loading={loading} />

        <ChatComposer
          value={draft}
          loading={loading}
          disabled={modelsLoading || !model}
          onChange={setDraft}
          onSubmit={askOllama}
        />
      </section>
    </main>
  )
}

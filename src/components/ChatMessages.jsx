import { useEffect, useMemo, useRef, useState } from 'react'
import MarkdownResult from './MarkdownResult.jsx'

function formatSize(size) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }

  return `${Math.round(size / 1024 / 1024)} MB`
}

function messageMatchesSearch(message, search) {
  const query = search.trim().toLowerCase()

  if (!query) {
    return false
  }

  const attachmentText = (message.attachments ?? [])
    .map(attachment => attachment.name)
    .join(' ')

  return `${message.content} ${attachmentText}`.toLowerCase().includes(query)
}

function clearSearchHighlights(container) {
  container.querySelectorAll('mark.search-highlight').forEach(mark => {
    mark.replaceWith(document.createTextNode(mark.textContent))
  })
  container.normalize()
}

function highlightSearchText(container, search) {
  const query = search.trim()

  clearSearchHighlights(container)

  if (!query) {
    return
  }

  const nodes = []

  container.querySelectorAll('.message-searchable').forEach(searchable => {
    const walker = document.createTreeWalker(searchable, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue) {
          return NodeFilter.FILTER_REJECT
        }

        return node.nodeValue.toLowerCase().includes(query.toLowerCase())
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT
      }
    })

    while (walker.nextNode()) {
      nodes.push(walker.currentNode)
    }
  })

  nodes.forEach(node => {
    const text = node.nodeValue
    const fragment = document.createDocumentFragment()
    let index = 0

    while (index < text.length) {
      const matchIndex = text.toLowerCase().indexOf(query.toLowerCase(), index)

      if (matchIndex === -1) {
        fragment.append(document.createTextNode(text.slice(index)))
        break
      }

      fragment.append(document.createTextNode(text.slice(index, matchIndex)))

      const mark = document.createElement('mark')

      mark.className = 'search-highlight'
      mark.textContent = text.slice(matchIndex, matchIndex + query.length)
      fragment.append(mark)
      index = matchIndex + query.length
    }

    node.replaceWith(fragment)
  })
}

export default function ChatMessages({ messages, loading, search, onEditMessage, onRegenerate }) {
  const messagesRef = useRef(null)
  const autoScrollRef = useRef(true)
  const [copiedId, setCopiedId] = useState('')
  const scrollKey = useMemo(
    () => messages.map(message => `${message.id}:${message.content.length}`).join('|'),
    [messages]
  )
  const lastAssistantId = [...messages].reverse().find(message => message.role === 'assistant')?.id

  useEffect(() => {
    if (!autoScrollRef.current) {
      return
    }

    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [scrollKey])

  useEffect(() => {
    if (!messagesRef.current) {
      return
    }

    highlightSearchText(messagesRef.current, search)
  }, [search, scrollKey])

  function handleScroll() {
    const element = messagesRef.current

    if (!element) {
      return
    }

    autoScrollRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 64
  }

  async function copyMessage(message) {
    await navigator.clipboard.writeText(message.content)
    setCopiedId(message.id)
    window.setTimeout(() => setCopiedId(''), 1200)
  }

  if (messages.length === 0) {
    return (
      <section className="messages empty-chat" ref={messagesRef}>
        
      </section>
    )
  }

  return (
    <section className="messages" aria-live="polite" ref={messagesRef} onScroll={handleScroll}>
      {messages.map(message => (
        <article
          className={`message ${message.role}${messageMatchesSearch(message, search) ? ' search-match' : ''}`}
          key={message.id}
        >
          <div className="message-top">
            <div className="message-label">
              {message.role === 'user' ? 'You' : 'Ollama'}
            </div>

            <div className="message-actions">
              {message.role === 'user' && (
                <button type="button" onClick={() => onEditMessage(message)}>
                  Edit
                </button>
              )}

              {message.role === 'assistant' && (
                <button type="button" onClick={() => copyMessage(message)}>
                  {copiedId === message.id ? 'Copied' : 'Copy'}
                </button>
              )}

              {message.id === lastAssistantId && !loading && (
                <button type="button" onClick={onRegenerate}>
                  Again
                </button>
              )}
            </div>
          </div>

          {message.role === 'assistant' ? (
            <div className="message-searchable">
              <MarkdownResult content={message.content || (loading ? 'Thinking...' : '')} />
            </div>
          ) : (
            <div className="message-searchable">
              <p>{message.content}</p>
              {message.attachments?.length > 0 && (
                <div className="message-attachments">
                  {message.attachments.map(attachment => (
                    <span key={attachment.id}>
                      {attachment.name} ({formatSize(attachment.size)})
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </article>
      ))}
    </section>
  )
}

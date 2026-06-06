const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ollamaDesktop', {
  tags() {
    return ipcRenderer.invoke('ollama:tags')
  },
  generate(body, onChunk) {
    const requestId = crypto.randomUUID()

    return new Promise((resolve, reject) => {
      function cleanup() {
        ipcRenderer.removeListener('ollama:generate-chunk', handleChunk)
        ipcRenderer.removeListener('ollama:generate-done', handleDone)
        ipcRenderer.removeListener('ollama:generate-error', handleError)
      }

      function handleChunk(_event, chunkRequestId, chunk) {
        if (chunkRequestId === requestId) {
          onChunk(chunk)
        }
      }

      function handleDone(_event, doneRequestId) {
        if (doneRequestId === requestId) {
          cleanup()
          resolve()
        }
      }

      function handleError(_event, errorRequestId, message) {
        if (errorRequestId === requestId) {
          cleanup()
          reject(new Error(message))
        }
      }

      ipcRenderer.on('ollama:generate-chunk', handleChunk)
      ipcRenderer.on('ollama:generate-done', handleDone)
      ipcRenderer.on('ollama:generate-error', handleError)
      ipcRenderer.send('ollama:generate', requestId, body)
    })
  }
})

export function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function canUseSpeechRecognition() {
  return Boolean(getSpeechRecognition())
}

export function speakText(text, onEnd) {
  if (!window.speechSynthesis || !text.trim()) {
    return false
  }

  const utterance = new SpeechSynthesisUtterance(text)

  utterance.onend = onEnd
  utterance.onerror = onEnd
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)

  return true
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
}

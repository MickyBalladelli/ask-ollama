export function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function canUseSpeechRecognition() {
  return Boolean(getSpeechRecognition())
}

export function speakText(text, options = {}, onEnd) {
  if (!window.speechSynthesis || !text.trim()) {
    return false
  }

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = window.speechSynthesis
    .getVoices()
    .find(currentVoice => currentVoice.name === options.voiceName)

  if (voice) {
    utterance.voice = voice
  }

  utterance.rate = Number(options.voiceRate) || 1
  utterance.pitch = Number(options.voicePitch) || 1
  utterance.onend = onEnd
  utterance.onerror = onEnd
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)

  return true
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
}

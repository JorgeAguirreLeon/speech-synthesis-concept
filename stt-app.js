// STT: Speech to text

// Since this is still experimental we need to use the webkit prefix on Chrome
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

function listenForText() {
  const listen = document.querySelector('#listen')
  // UI updates
  listen.disabled = true
  listen.classList.add('animation--heartbeat')
  // Configure options
  const recognition = new SpeechRecognition()
  recognition.grammars = new SpeechGrammarList()
  recognition.lang = 'es-ES'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.start()
  // Events available but since this is so simple, we just log them.
  recognition.onaudiostart = event=> console.log('[STT] Now capturing live audio')
  recognition.onaudioend = event=> console.log('[STT] Finished capturing live audio')
  recognition.onend = event=> console.log('[STT] Recognition service has ended successfully')
  recognition.onnomatch = event=> console.log('[STT] No comprehensible speech found (Either noise or not passing the threshold)')
  recognition.onsoundstart = event=> console.log('[STT] Sounds (speech or noise) detected')
  recognition.onsoundend = event=> console.log('[STT] Sounds (speech or noise) not detected anymore')
  recognition.onspeechstart = event=> console.log('[STT] Comprehensible speech detected')
  recognition.onstart = event=> console.log('[STT] Started')
  // Actual operation - When we have an actionable result
  recognition.onresult = event=> {
    const result = event.results[0][0]
    console.log(`[STT] Obtained the following text: ${result.transcript}`)
    console.log(`[STT] With confidence: ${result.confidence}`)
    document.querySelector('#output-stt').value = result.transcript
    document.querySelector('#output-stt-confidence').value = `Confianza: ${(100 * result.confidence).toFixed(2)}%`
  }
  // Actual operation - When we no longer have a speech
  recognition.onspeechend = ()=> {
    recognition.onspeechstart = event=> console.log('[STT] Comprehensible speech ended -> Handling result')
    // Stop recognition
    recognition.stop()
    // UI updates
    listen.disabled = false
    listen.classList.remove('animation--heartbeat')
  }
  // Actual operation - Error handler
  recognition.onerror = event=> {
    console.error('[STT] Error occurred in recognition: ' + event.error)
    // UI updates
    listen.disabled = false
    listen.classList.remove('animation--heartbeat')
  }
}

document.querySelector('#listen').onclick = ()=> listenForText()

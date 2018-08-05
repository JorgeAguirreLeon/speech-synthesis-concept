// Text to Speech
if (!('speechSynthesis' in window)) {
  console.error('[TTS] Text to speech not available')
}

// Alias for shorter code
const getFromDOM = selector=> document.querySelector(selector)

const synth = window.speechSynthesis

const populate_voices = ()=> {
  // Get the <select> item
  const speech_voice = getFromDOM('#voice-selector')
  // Clear it
  speech_voice.innerHTML = ''
  /*
   * Get the voices from the Synthesis
   * Filter to only spanish
   * Create <option> element inside the <select>
   */
  synth.getVoices()
    .filter(voice=> voice.lang === 'es-ES')
    .forEach(voice=> {
      const option = document.createElement('option')
      option.textContent = voice.name
      if (voice.default) option.textContent += ' [Por defecto]'
      speech_voice.appendChild(option)
    })
}

const speak = ()=> {
  // No double-speak: log an error and end this.
  if (synth.speaking) {
    console.error('[TTS] Already speaking!')
    return
  }
  // Get the text to play
  const text = getFromDOM('#input-tts').value
  const play_button = getFromDOM('#play')
  // If there is no text, end this.
  if (text === '') {
    console.error('[TTS] No text to say')
    return
  }
  // Create the utterance and configure the voice, pitch and rate
  const utterance = new SpeechSynthesisUtterance(text)
  const selected_voice = getFromDOM('#voice-selector').selectedOptions[0].textContent
  utterance.voice = synth.getVoices().filter(voice=> voice.lang === 'es-ES').find(voice=> voice.name === selected_voice)
  utterance.pitch = getFromDOM('#pitch').value
  utterance.rate = getFromDOM('#rate').value
  // Handle error and end events
  utterance.onend = event=> {
    console.log('[TTS] Finished saying what it had to say')
    play_button.disabled = false
    play_button.classList.remove('animation--heartbeat')
  }
  utterance.onerror = event=> {
    console.error('[TTS] Unexpected error ocurred while saying things')
    play_button.disabled = false
    play_button.classList.remove('animation--heartbeat')
  }
  // Detailed log
  console.log(`[TTS] Will now say: "${text}"`)
  console.log(`[TTS] Synthesis options: Pitch=${utterance.pitch} & Rate=${utterance.rate}`)
  // UI updates
  play_button.disabled = true
  play_button.classList.add('animation--heartbeat')
  // Actually speak
  synth.speak(utterance)
}

// Listener to submit the form
getFromDOM('form').onsubmit = event=> {
  event.preventDefault()
  speak()
  getFromDOM('#input-tts').blur()
}

// Listeners to update UI with input changes
getFromDOM('#pitch').onchange = ()=> getFromDOM('.pitch-value').textContent = getFromDOM('#pitch').value
getFromDOM('#rate').onchange = ()=> getFromDOM('.rate-value').textContent = getFromDOM('#rate').value

// Configure listener for voice change and actually populate the voices for the first time
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = populate_voices
populate_voices()

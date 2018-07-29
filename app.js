const synth = window.speechSynthesis

const inputForm = document.querySelector('form')
const inputTxt = document.querySelector('.txt')
const voiceSelect = document.querySelector('select')

const pitch = document.querySelector('#pitch')
const pitchValue = document.querySelector('.pitch-value')
const rate = document.querySelector('#rate')
const rateValue = document.querySelector('.rate-value')

let voices = []

function populateVoiceList() {
  voices = synth.getVoices()
  let selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex
  voiceSelect.innerHTML = ''
  for (i=0; i<voices.length; i++) {
    const option = document.createElement('option')
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')'

    if (voices[i].default) option.textContent += ' -- DEFAULT'

    option.setAttribute('data-lang', voices[i].lang)
    option.setAttribute('data-name', voices[i].name)
    voiceSelect.appendChild(option)
  }
  voiceSelect.selectedIndex = selectedIndex
}

populateVoiceList()

if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = populateVoiceList

function speak() {
  if (synth.speaking) {
    console.error('speechSynthesis.speaking')
    return
  }
  if (inputTxt.value !== '') {
    let utterThis = new SpeechSynthesisUtterance(inputTxt.value)
    utterThis.onend = event=> console.log('SpeechSynthesisUtterance.onend')
    utterThis.onerror = event=> console.error('SpeechSynthesisUtterance.onerror')
    let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name')

    for (i=0; i<voices.length; i++) {
      if (voices[i].name === selectedOption) utterThis.voice = voices[i]
    }
    utterThis.pitch = pitch.value
    utterThis.rate = rate.value
    synth.speak(utterThis)
  }
}

inputForm.onsubmit = event=> {
  event.preventDefault()
  speak()
  inputTxt.blur()
}

pitch.onchange = ()=> pitchValue.textContent = pitch.value
rate.onchange = ()=> rateValue.textContent = rate.value
voiceSelect.onchange = ()=> speak()

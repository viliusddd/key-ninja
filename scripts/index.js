import Cursor from "./cursor.js"
import Display from "./display.js"
import Key from "./key.js"
import { specialKeys } from "./config.js"

document.addEventListener('DOMContentLoaded', () => {
  touchTyping(document.querySelector('.app'))
})

/**
 * Initialize touch-typing application
 * @param {Element} appElement - root element of application
 * @return {Promise<void>}
 */
function touchTyping(appElement) {
  document.addEventListener('keydown', () => timer(appElement), { once: true })

  const counter = appElement.querySelector('.counter')
  const abortController = new AbortController();
  const { signal } = abortController

  const cursor = new Cursor(appElement)
  const displayElement = appElement.querySelector('.display')
  const display = new Display(displayElement, cursor)
  display.create()

  const resetElement = appElement.querySelector('.reset')
  console.log(resetElement)
  resetElement.addEventListener('click', () => display.restart())

  const stats = new Stats(appElement)
  stats.grossWPM()
  stats.accuracy()

  document.addEventListener('keydown', async (evt) => {
    if (counter.innerText === '0') abortController.abort()
    const key = new Key(evt, cursor, appElement)

    type(key, evt, display)
  }, { signal })
}

function type(key, evt, display) {
  if (evt.key === ' ') {
    if (!key.isFirstWordLetter()) key.nextWord()
  } else if (specialKeys.some(item => evt.key === item)) {
    return
  } else if (evt.key === 'Backspace') {
    key.prev()
  } else if (evt.key === 'Enter') {
    display.restart()
  } else if (evt.key === 'Escape') {
    display.reset()
  } else if (evt.key === key.letter) {
    key.next(true)
  } else {
    key.next(false)
  }
}

class Stats {
  constructor(appElement) {
    this.appElement = appElement
    this.statsElement = appElement.querySelector('.stats')
    this.wordsElement = appElement.querySelector('.words')
    // this.grossWPM()
  }

  grossWPM() {
    let timeElapsed = 0

    let timer = setInterval(() => {
      timeElapsed++
      this.correct = this.wordsElement.querySelectorAll('.correct')
      this.incorrect = this.wordsElement.querySelectorAll('.incorrect')
      this.correct = this.correct ? this.correct.length : 0
      this.incorrect = this.incorrect ? this.incorrect.length : 0

      let corrWords = this.correct / 5
      corrWords += (corrWords / 5)
      console.log(Math.floor(corrWords))
      let wpm = Math.round((corrWords / timeElapsed) * 60);

      const wpmElement = this.appElement.querySelector('.wpm > div:last-child')
      wpmElement.innerText = wpm
      const timerElement = this.appElement.querySelector('.counter')
      if (timerElement.innerText === '0') clearInterval(timer)
    }, 1000)
  }
  accuracy() {
    // separate accuracy calculation from adding it to element, do the same with wpm
    // stats should start together with touch typing
    let timer = setInterval(() => {
      this.correct = this.wordsElement.querySelectorAll('.correct')
      this.incorrect = this.wordsElement.querySelectorAll('.incorrect')
      this.correct = this.correct ? this.correct.length : 0
      this.incorrect = this.incorrect ? this.incorrect.length : 0

      let accuracy = (this.correct === 0 && this.incorrect === 0)
        ? 0
        : ((this.correct / (this.correct + this.incorrect)) * 100)

      const accuracyElement = this.appElement
        .querySelector('.accuracy > div > div:first-child')

      accuracyElement.innerText = Math.round(accuracy);

      const timerElement = this.appElement.querySelector('.counter')

      if (timerElement.innerText === '0') clearInterval(timer)
    }, 1000)
  }
}

function timer(element) {
  const counterElement = element.querySelector('.counter')
  let count = counterElement.innerText - 1

  let timer = setInterval(() => {
    counterElement.innerText = count--
    if (count < 0) clearInterval(timer)
  }, 1000)
}


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
  stats.refreshStats()

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
  }

  drawGraph() { }

  storeResult() { }

  retrieveResults() { }

  /**
   * Get total typed words, words with errors,
   * total letters and letters with errors.
   * @return {object}
   */
  typingStats() {
    // get all words before active word
    const siblings = []
    let element = this.wordsElement.querySelector('.active')
    if (!element) return

    while (element = element.previousSibling) siblings.push(element)

    let ltrTotal = 0
    let ltrCorrect = 0

    for (const word of siblings) {
      if (!word.classList.contains('error')) ltrTotal++ //count " " after word

      for (const letter of word.childNodes) {
        ltrTotal++
        if (letter.classList.contains('correct')) ltrCorrect++
      }
    }

    const wrdTotal = siblings.length
    const wrdCorrect = siblings
      .filter(sib => !sib.classList.contains('error'))
      .reduce((accum, _) => accum += 1, 0)

    return { ltrTotal, ltrCorrect, wrdTotal, wrdCorrect, }
  }

  roundNum(num) {
    return num.toLocaleString(
      undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }
    )
  }

  /** Refresh WPM and Accuracy statistics every second */
  refreshStats() {
    let timeElapsed = 0

    let statsRefresh = setInterval(() => {
      timeElapsed++
      const stats = this.typingStats()
      console.log(stats)

      const wpm = Math.round(stats.ltrTotal / 5 / timeElapsed * 60);
      const accuracy = stats.ltrCorrect / stats.ltrTotal * 100

      const wpmElement = this.appElement.querySelector('.wpm > div:last-child')
      const accElement = this.appElement
        .querySelector('.accuracy > div > div:first-child')

      if (wpm) wpmElement.innerText = wpm
      if (accuracy) accElement.innerText = this.roundNum(accuracy)

      const timerElement = this.appElement.querySelector('.counter')
      if (timerElement.innerText === '0') clearInterval(statsRefresh)
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


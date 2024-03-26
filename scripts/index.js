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
async function touchTyping(appElement) {
  document.addEventListener('keydown', () => timer(appElement), { once: true })

  const counter = appElement.querySelector('.counter')
  const abortController = new AbortController();
  const { signal } = abortController

  const display = new Display(appElement.querySelector('.display'))
  await display.buildWords()

  document.addEventListener('keydown', async (evt) => {
    if (counter.innerText === '0') abortController.abort()

    const cursor = new Cursor(appElement)
    const stats = new Stats(appElement)
    const key = new Key(evt, cursor, appElement)

    await type(key, evt, stats, display)
  }, { signal })
}

async function type(key, evt, stats, display) {
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
  stats.grossWPM()
}

class Stats {
  constructor(appElement) {
    this.statsElement = appElement.querySelector('.stats')
    this.wordsElement = appElement.querySelector('.words')
    this.grossWPM()
  }

  grossWPM() {
    let correct = this.wordsElement.querySelectorAll('.correct')
    let incorrect = this.wordsElement.querySelectorAll('.incorrect')
    correct = correct ? correct.length : 0
    incorrect = incorrect ? incorrect.length : 0

    const formula = ((correct + incorrect) / 5) * 60
    this.statsElement.querySelector('.stats > div:first-child').innerText = formula
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

function reset(appElement) {
  appElement.querySelector('.counter').innerText = 60
}

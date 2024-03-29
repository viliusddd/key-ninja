import Cursor from "./cursor.js"
import Display from "./display/display.js"
import Key from "./key.js"
import Stats from "./stats/index.js"
import { specialKeys } from "./config.js"

let APP_RUN = false //! should it really be capitalized?

document.addEventListener('DOMContentLoaded', () => {
  touchTyping(document.querySelector('.app'))
})

/**
 * Initialize touch-typing application
 * @param {Element} appElement - root element of application
 * @return {Promise<void>}
 */
function touchTyping(appElement) {
  const counter = appElement.querySelector('.counter')
  const displayElement = appElement.querySelector('.display')

  const abortController = new AbortController();
  const { signal } = abortController

  const cursor = new Cursor(appElement)
  const display = new Display(displayElement, cursor)

  const resetElement = appElement.querySelector('.reset')
  resetElement.addEventListener('click', () => display.restart(appElement))

  document.addEventListener('keydown', async (evt) => {
    if (counter.innerText === '0') abortController.abort()

    if (evt.key === 'Enter') display.restart(appElement)
    if (evt.key === 'Escape') display.reset(appElement)

    const key = new Key(evt, cursor, appElement)
    type(key, evt, display, appElement)

    if (!appElement.classList.contains('runs')) {
      appElement.classList.add('runs')

      display.timer(appElement)

      const stats = new Stats(appElement)
      stats.refreshStats()
    }

    // if (appElement.querySelector('.counter').innerText === '0') {
    //   storeResult
    // }

  }, { signal })
  // stats.storeResult()
}

function type(key, evt) {
  if (evt.key === ' ') {
    if (!key.isFirstWordLetter()) key.nextWord()
  } else if (specialKeys.some(item => evt.key === item)) {
    return
  } else if (evt.key === 'Backspace') {
    key.prev()
  } else if (evt.key === key.letter) {
    key.next(true)
  } else {
    key.next(false)
  }
}

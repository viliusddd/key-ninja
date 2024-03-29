import Cursor from "./cursor.js"
import Display from "./display/display.js"
import Key from "./key.js"
import Stats from "./stats/index.js"
import { specialKeys } from "./config.js"
import status from "./status.js"

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
  const timer = appElement.querySelector('.timer')
  const displayElement = appElement.querySelector('.display')


  const cursor = new Cursor(appElement)
  const display = new Display(displayElement)

  const resetElement = appElement.querySelector('.reset')
  resetElement.addEventListener('click', () => display.restart(appElement))

  const { startApp, stopApp, appIsRunning } = status(appElement)

  document.addEventListener('keydown', async (evt) => {
    if (evt.key === 'Enter') display.restart(appElement)
    if (evt.key === 'Escape') display.reset(appElement)

    if (!appIsRunning() && !appElement.classList.contains('finished')) {
      startApp()

      display.timer(appElement)

      const stats = new Stats(appElement)
      stats.refreshStats()

    } else if (appElement.classList.contains('finished')) {
      return
    }

    const key = new Key(evt, cursor, appElement)
    type(key, evt, display, appElement)

    // if (appElement.querySelector('.timer').innerText === '0') {
    //   storeResult
    // }

  })
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

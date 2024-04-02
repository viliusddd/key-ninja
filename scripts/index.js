import Cursor from "./cursor.js"
import Display from "./display/display.js"
import Key from "./key.js"
import Stats from "./stats/index.js"
import { specialKeys } from "./config.js"
import appStatus from "./appStatus.js"

document.addEventListener('DOMContentLoaded', () => {
  touchTyping(document.querySelector('.app'))
})

/**
 * Initialize touch-typing application
 * @param {Element} appElement - root element of application
 * @return {Promise<void>}
 */
function touchTyping(appElement) {
  const cursor = new Cursor(appElement)
  const stats = new Stats(appElement)
  const display = new Display(appElement, stats)

  // Restart BTN
  const resetElement = appElement.querySelector('.reset')
  resetElement.addEventListener('click', () => {
    display.restart()
    cursor.reset()
    resetElement.blur() // remove focus after Shift key press
  })

  const { startApp, stopApp, appRunning, appFinished } = appStatus(appElement)

  let corrections = 0

  document.addEventListener('keydown', async (evt) => {
    if (evt.key === 'Enter') {
      if (appFinished() || appRunning()) display.restart(), cursor.reset()
      if (!appRunning()) return
    } else if (evt.key === 'Escape') {
      if (appFinished() || appRunning()) display.restart(true), cursor.reset()
      if (!appRunning()) return
    }

    if (!appRunning() && !appFinished()) {
      startApp()

      display.timer(appElement)
      sessionStorage.setItem('corrections', 0)
    }

    if (appRunning()) {
      if (evt.key === 'Backspace') {
        corrections++
        sessionStorage.setItem('corrections', corrections)
      }

      const key = new Key(evt, cursor, appElement)
      type(key, evt, display, appElement)
    }
  })
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

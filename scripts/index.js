import appStatus from './appStatus.js'
import Cursor from './cursor.js'
import Display from './display.js'
import Key from './key.js'
import Stats from './stats.js'
import {specialKeys} from './config.js'

document.addEventListener('DOMContentLoaded', () => {
  touchTyping(document.querySelector('.app'))
})

/**
 * Initialize touch-typing application
 * @param {Element} appElement - root element of application
 */
function touchTyping(appElement) {
  const cursor = new Cursor(appElement)
  const stats = new Stats(appElement)
  const display = new Display(appElement, stats)

  // Restart Button
  const resetElement = appElement.querySelector('.reset')
  resetElement.addEventListener('click', () => {
    display.restart()
    cursor.reset()
    resetElement.blur() // remove focus after Shift key press
  })

  const {startApp, stopApp, appRunning, appFinished} = appStatus(appElement)

  let corrections = 0

  document.addEventListener('keydown', async (evt) => {
    if (evt.key === 'Enter') {
      if (appFinished() || appRunning()) display.restart(), cursor.reset()
      if (!appRunning()) return
    } else if (evt.key === 'Escape') {
      if (appFinished() || appRunning()) display.restart(true), cursor.reset()
      if (!appRunning()) return
    } else if (evt.key === ' ' && evt.target == document.body) {
      evt.preventDefault() // prevent space from moving page down
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

/**
 * Compare key press with current letter on display.
 * @param {Key} key - Key class object. Deals with key presses.
 * @param {KeyboardEvent} evt - event describes a single interaction
 * between the user and a key on the keyboard.
 */
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

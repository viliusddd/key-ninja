import { apiUrl, specialKeys } from "./consts.js"
import Key from "./key.js"
import Cursor from "./cursor.js"
import { getApiJson, buildDivFromWords, convertJsonToWords } from "./utils.js"

document.addEventListener('DOMContentLoaded', () => {
  touchTyping(document.querySelector('.app'))
})

/**
 * Initialize touch-typing application
 * @param {Element} appElement - root element of application
 * @return {Promise<void>}
 */
async function touchTyping(appElement) {
  const lines = await getApiJson(apiUrl)
  const words = convertJsonToWords(lines)
  buildDivFromWords(appElement, words)

  document.addEventListener('keydown', (evt) => {
    const cursor = new Cursor(appElement)
    const key = new Key(evt, cursor, appElement)
    type(key, evt)
  })
}

async function type(key, evt) {
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

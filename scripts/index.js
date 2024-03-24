import {apiUrl, specialKeys} from "./consts.js"
import {Key} from "./key.js"
import {Cursor} from "./cursor.js"
import {getApiJson, buildDivFromWords, convertJsonToWords} from "./utils.js"


/**
 * Cheks if event.key match letter from supplied text.
 * @param {KeyboardEvent} evt
 */
function onKeyDown(evt) {
  const cursor = new Cursor()
  const key = new Key(evt, cursor)

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

/**
 * Initialize touch-typing application
 * @return {Promise<void>}
 */
async function initTouchTyping(){
  const lines = await getApiJson(apiUrl)
  const words = convertJsonToWords(lines)
  buildDivFromWords(words)
  document.addEventListener('keydown', (evt) => onKeyDown(evt))
}

document.addEventListener('DOMContentLoaded', () => {
  initTouchTyping()
})

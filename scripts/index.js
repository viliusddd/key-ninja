import {apiUrl, specialKeys} from "./consts.js"
import {Key} from "./key.js"
import {getApiJson, buildDivFromWords, convertJsonToWords} from "./utils.js"


function onKeyDown(evt) {
  const key = new Key(evt)

  if (evt.key === ' ') {
    if (!key.isFirstLetter()) key.goToNextWord()
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
 * Initialize touch typing application
 * @return {Promise<void>}
 */
async function initTouchTyping(){
  const lines = await getApiJson(apiUrl)
  const words = convertJsonToWords(lines)
  buildDivFromWords(words)
  // document.addEventListener('keydown', (evt) => onKeyDown(evt))
  document.addEventListener('keydown', (evt) => onKeyDown(evt))
}

document.addEventListener('DOMContentLoaded', () => {
  initTouchTyping()
})

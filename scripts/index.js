// @ts-check

import {apiUrl} from "./consts.js"

/**
 * Get and format api response to single string
 * @param {string} url api url
 * @return {Promise<string>}
 */
async function getApiJson(url) {
  const response = await fetch(url)
  return await response.json()
}

/**
 * Convert api response json to array of strings.
 * @param {object} responseJson - json response from api
 * @return {string[]}
 */
function convertJsonToWords(responseJson) {
  const lines = responseJson[0].lines

  const words = lines
    .reduce((accum, line) => `${accum} ${line}`, '')
    .trim()
    .split(' ')
    .filter(word => word)

  return words
}

function buildDivFromWords(words) {
  const wordsDiv = document.getElementById('words')

  words.forEach(word => {
    const wordElement = document.createElement('div')
    wordElement.className = 'word';

    [...word].forEach(letter => {
      const letterElement = document.createElement('div')
      letterElement.className = 'letter'
      letterElement.innerText = letter

      wordElement?.appendChild(letterElement);
    })

    wordsDiv?.appendChild(wordElement);
  })
}

function initCursor() {
  const cursor = document.getElementById('cursor')
  const cursorBound = cursor.getBoundingClientRect()
  cursor.style.left = cursorBound.x + 4.3 + 'px'
}

function newCursorPos(letterNode) {
  const letterBound = letterNode.getBoundingClientRect()
  const cursor = document.getElementById('cursor')
  const newCursorPosition = letterBound.x - 1 + 'px'
  return newCursorPosition
}

function keyPress() {
  const letterNodes = document.querySelectorAll('.letter')

  // get girst letter node and it's text
  const specialKeys = [
    'Control', 'Shift', 'Meta', 'Alt', 'Escape', 'ArrowUp', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', '§', 'Enter'
  ]
  let cursor = document.getElementById('cursor')
  let letterNode = letterNodes[0]
  let letter = letterNode.innerText

  let num = 0
  let oldNum

  document.addEventListener('keydown', (event) => {
    if (event.key == letter) {
      console.log(`Event:${event.key} & letter:${letter} match`)
      oldNum = num
      num++

      letter = letterNodes[num].innerText
      letterNodes[oldNum].style.color = 'green'
      cursor.style.left = newCursorPos(letterNodes[num])

    } else if (event.key == 'Backspace') {
      console.log(`Event:${event.key} & letter:${letter}`)
      oldNum = num
      num = num > 0 ? num - 1 : 0

      letter = letterNodes[num].innerText
      letterNodes[num].style.color = 'black'
      cursor.style.left = newCursorPos(letterNodes[num])

    } else if (specialKeys.some(item => event.key === item)) {
      console.log(`Event:${event.key} & letter:${letter}`)
      return

    } else {
      console.log(`letter ${event.key} and ${letter} don't match`)
      oldNum = num
      num++
      cursor.style.left = newCursorPos(letterNodes[num])
      letterNodes[oldNum].style.color = 'red'
    }
  })
}

function moveCursor() {
  const cursor = document.getElementById('cursor')
  const bound = cursor?.getBoundingClientRect()
}
/**
 * Initialize touch typing application
 * @return {Promise<void>}
 */
async function initTouchTyping(){
  const lines = await getApiJson(apiUrl)
  const words = convertJsonToWords(lines)
  buildDivFromWords(words)
  initCursor()
  keyPress()
}

document.addEventListener('DOMContentLoaded', () => {
  initTouchTyping()
})

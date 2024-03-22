// //@ts-check
"use strict"

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
  const firstLetterBound = document.querySelector('.letter').getBoundingClientRect()
}

function adjustCursorOnScrChange() {
  window.addEventListener('resize', () => {
  })
}

function newCursorPos(letterNode) {
  const letterBound = letterNode.getBoundingClientRect()
  const cursorX = letterBound.x + letterBound.width - 1
  console.log(cursorX)
  return cursorX
}

function keyPress() {
  const specialKeys = [
    'Control', 'Shift', 'Meta', 'Alt', 'Escape', 'ArrowUp', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', '§', 'Enter'
  ]
  let cursor = document.getElementById('cursor')
  let wordNode = document.querySelector('.word')
  let letterNode = wordNode.firstChild
  let letter = letterNode.innerText

  let bound = cursor.getBoundingClientRect().x
  console.log(cursor.getBoundingClientRect().x)

  const changeCursorX = (x, width = 0) => x + width - 1

  const newWord = (wordNode) => {
    return {
      wordNode: wordNode.nextElementSibling,
      letterNode: () => (this.wordNode).firstChild,
      letter: () => (this.letterNode).innerText
    }
  }

  let rowGoesUp = false
  let nextWordStart = false

  document.addEventListener('keydown', (event) => {


    if ((event.key === ' ') && (letterNode === wordNode.firstChild)) {
      console.log('space key and first new word letter')
      nextWordStart = false

      // move cursor upfront by 1 character
      let letterBound = letterNode.getBoundingClientRect()
      let cursorX = changeCursorX(letterBound.x, -0.5) // get future Cursor position

      cursor.style.left = cursorX + 'px'

      if (rowGoesUp) {
        const words = document.getElementById('words')
        const wordsBound = words.getBoundingClientRect()
        const wordsY = wordsBound.y - letterBound.height - 12 + 'px'
        words.style.top = wordsY
        rowGoesUp = false
      }

      console.log(`cursor> ${cursorX}, ${letterBound.x}`)

    } else if (event.key === letter) {
      console.log(event.key, letter)
      nextWordStart = false

      // move cursor upfront by 1 character
      let letterBound = letterNode.getBoundingClientRect()
      let cursorX = changeCursorX(letterBound.x, letterBound.width)
      cursor.style.left = cursorX + 'px' // move cursor to new position
      console.log(cursorX, 'key=letter')

      letterNode.style.color = 'green'

      // prepare letter for next check
      if (letterNode.nextSibling) {
        letterNode = letterNode.nextElementSibling
        letter = letterNode.innerText
      } else {
        console.log('nextWordStart: last letter, taking letter from next word start')
        nextWordStart = true
        wordNode = wordNode.nextElementSibling
        letterNode = wordNode.firstChild
        letter = letterNode.innerText

        // if end of line
        letterBound = letterNode.getBoundingClientRect()
        const currentCursorX = changeCursorX(letterBound.x, letterBound.width)
        if (currentCursorX < cursorX) {
          console.log('end of line')
          rowGoesUp = true
        }
      }
      console.log(`cursor: ${cursorX}, ${letterBound.x}`)

    } else if (specialKeys.some(item => event.key === item)) {
      return

    } else if (event.key == 'Backspace') {
      console.log(`Event:${event.key} & letter:${letter}`)

      if (!letterNode.previousSibling && nextWordStart) {
        console.log('nextWordStart = true')
        wordNode = wordNode.previousElementSibling
        letterNode = wordNode.lastChild
        letter = letterNode.innerText

        let letterBound = letterNode.getBoundingClientRect()
        let cursorX = changeCursorX(letterBound.x) // get future Cursor position
        cursor.style.left = cursorX + 'px' // move cursor to new position

        nextWordStart = false
        letterNode.style.color = 'black'
        return
      }

      nextWordStart = false

      console.log('>', letterNode)
      if (letterNode.previousElementSibling) {
        letterNode = letterNode.previousElementSibling
        letter = letterNode.innerText
      }
      // move cursor back by 1 character
      let letterBound = letterNode.getBoundingClientRect()
      let cursorX = changeCursorX(letterBound.x) // get future Cursor position
      cursor.style.left = cursorX + 'px' // move cursor to new position
      console.log('1', cursorX)
      // prepare letter for next check

      // letterNode = letterNode.previousSibling
      // letter = letterNode.innerText
      letterNode.style.color = 'black'

    } else {
      console.log(`letter ${event.key} and ${letter} don't match`)
      nextWordStart = false

      // move cursor upfront by 1 character
      let letterBound = letterNode.getBoundingClientRect()
      let cursorX = changeCursorX(letterBound.x, letterBound.width) // get future Cursor position
      cursor.style.left = cursorX + 'px' // move cursor to new position
      console.log(cursorX, 'red')

      letterNode.style.color = 'red'
      // prepare letter for next check
      if (letterNode.nextElementSibling) {
      letterNode = letterNode.nextElementSibling
        letter = letterNode.innerText
      } else {
        console.log('nextWordStart: last letter, taking letter from next word start')
        nextWordStart = true
        wordNode = wordNode.nextElementSibling
        letterNode = wordNode.firstChild
        letter = letterNode.innerText
      }
    }
  })
}

/**
 * Initialize touch typing application
 * @return {Promise<void>}
 */
async function initTouchTyping(){
  const lines = await getApiJson(apiUrl)
  const words = convertJsonToWords(lines)
  window.addEventListener('resize', initCursor)
  // window.addEventListener('resize', initCursor)
  buildDivFromWords(words)
  keyPress()
}

document.addEventListener('DOMContentLoaded', () => {
  initTouchTyping()
})

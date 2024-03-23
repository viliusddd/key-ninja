// //@ts-check
"use strict"

import {apiUrl, specialKeys} from "./consts.js"
import {remCls} from "./utils.js"

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

    [...word].forEach(ltr => {
      const letterElement = document.createElement('div')
      letterElement.className = 'letter'
      letterElement.innerText = ltr

      wordElement?.appendChild(letterElement);
    })

    wordsDiv?.appendChild(wordElement);
  })
}

function initCursor() {
  const cursor = document.getElementById('cursor')
  const firstLetterBound = document.querySelector('.letter').getBoundingClientRect()
  cursor.style.left = firstLetterBound.x -1 + 'px'
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

function mvCursorToNextRow(letterNode) {
  console.log(letterNode)
  const wordsNode = document.getElementById('words')
  const wordsBound = wordsNode.getBoundingClientRect()
  const letterBound = letterNode.getBoundingClientRect()
  console.log(letterBound)
  const wordsY = wordsBound.y - letterBound.height - 12 + 'px'
  words.style.top = wordsY
}

/**
 * Increase the cursor x value by the width of HTML Element width or
 * optional number.
 * @param {DOMRect} bound - bounding box of parent Element
 * @param {number} [width] - number to increase the cursor x value with
 * @return {number} how many pixels to move on x axis
 */
function changeCursorX (bound, width = null) {
  if (width === null) width = bound.width;
  return bound.x + width - 1
}

function keyPress() {
  let cursor = document.getElementById('cursor')
  let wordNode = document.querySelector('.word')
  let letterNode = wordNode.firstChild

  console.log(cursor.getBoundingClientRect().x)


  let rowGoesUp = false
  let nextWordStart = false

  document.addEventListener('keydown', (event) => {

    if ((event.key === ' ') && (letterNode === wordNode.firstChild)) {
      console.log('space key and first new word letter')
      nextWordStart = false

      // move cursor upfront by 1 character
      let cursorX = changeCursorX(letterNode.getBoundingClientRect(), -0.5)
      cursor.style.left = cursorX + 'px'

      // mark word as incorrect
      const containsErr = node => node.classList.contains('incorrect')
      const cn = wordNode.previousElementSibling.childNodes
      if ([...cn].some(containsErr)) {
        wordNode.previousElementSibling.classList.add('error')
      }
      if (rowGoesUp) {
        mvCursorToNextRow(letterNode)
        rowGoesUp = false
      }

    } else if (event.key === letterNode.innerText) {
      console.log(event.key, letterNode.innerText)
      nextWordStart = false

      // move cursor upfront by 1 character
      let cursorX = changeCursorX(letterNode.getBoundingClientRect())
      cursor.style.left = cursorX + 'px'

      letterNode.classList.add('correct')

      // prepare letter for next check
      if (letterNode.nextSibling) {
        letterNode = letterNode.nextElementSibling
      } else {
        console.log('nextWordStart: last letter, taking letter from next word start')
        nextWordStart = true
        wordNode = wordNode.nextElementSibling
        letterNode = wordNode.firstChild

        // if end of line
        const currentCursorX = changeCursorX(letterNode.getBoundingClientRect())
        if (currentCursorX < cursorX) {
          console.log('end of line')
          rowGoesUp = true
        }
      }

    } else if (specialKeys.some(item => event.key === item)) {
      return

    } else if (event.key == 'Backspace') {
      console.log(`Event:${event.key} & letter:${letterNode.innerText}`)

      if (!letterNode.previousSibling && nextWordStart) {
        wordNode = wordNode.previousElementSibling
        letterNode = wordNode.lastChild

        let cursorX = changeCursorX(letterNode.getBoundingClientRect(), 0)
        cursor.style.left = cursorX + 'px'

        nextWordStart = false

        letterNode.classList.remove('correct', 'incorrect')
        return
      }

      nextWordStart = false

      if (letterNode.previousElementSibling) {
        letterNode = letterNode.previousElementSibling
      }

      // move cursor back by 1 character
      let cursorX = changeCursorX(letterNode.getBoundingClientRect(), 0)
      cursor.style.left = cursorX + 'px'

      letterNode.classList.remove('correct', 'incorrect')

    } else {
      console.log(`letter ${event.key} and ${letterNode.innerText} don't match`)
      nextWordStart = false

      // move cursor upfront by 1 character
      let cursorX = changeCursorX(letterNode.getBoundingClientRect())
      cursor.style.left = cursorX + 'px'

      letterNode.classList.add('incorrect')

      // prepare letter for next check
      if (letterNode.nextElementSibling) {
        letterNode = letterNode.nextElementSibling
      } else {
        nextWordStart = true
        wordNode = wordNode.nextElementSibling
        letterNode = wordNode.firstChild
      }

      // if end of line
      const currentCursorX = changeCursorX(letterNode.getBoundingClientRect())
      if (currentCursorX < cursorX) {
        console.log('end of line')
        rowGoesUp = true
      }
    }
  })
}

function timer(count = 59) {
  let timer = setInterval(() => {
    document.getElementById('counter').innerText = count--
    if (count < 0) {
      clearInterval(timer)
      // remove keydown event lisener here
    }
  }, 1000)
}

function resetBtn() {
  document.getElementById('counter').innerText = 60;

  ['correct', 'incorrect', 'error'].forEach(cls => remCls(cls))

  initCursor()
  // remove keydown event? document.removeEventListener("",generate_func);
  // reset timer to 60
  //reset .words y axis to 0
  //reset cursor x axis to .words bounding box x axis
  // cursor.style.left = words.getBoundingClientRect().y
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
  document.addEventListener('keydown', () => {timer(3)}, {once: true})
  document.getElementById('reset').addEventListener('click', resetBtn)
  keyPress()
}

document.addEventListener('DOMContentLoaded', () => {
  initTouchTyping()
})

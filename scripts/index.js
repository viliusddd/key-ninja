// @ts-check
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
  // const cursorBound = cursor.getBoundingClientRect()
  // cursor.style.left = cursorBound.x + 4.3 + 'px'
  const firstLetterBound = document.querySelector('.letter').getBoundingClientRect()
  // cursor.style.left = firstLetterBound.x + 4.3 + 'px'
  // cursor.style.left = firstLetterBound.x - 1 + 'px'
}

function adjustCursorOnScrChange() {
  window.addEventListener('resize', () => {
  })
}

function newCursorPos(letterNode) {
  const letterBound = letterNode.getBoundingClientRect()
  const cursorX = letterBound.x + letterBound.width - 1 + 'px'
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

  console.log(cursor.getBoundingClientRect().x)
  const changeCursorX = (x, width) => x + width - 1 + 'px'

  const newWord = (wordNode) => {
    return {
      wordNode: wordNode.nextElementSibling,
      letterNode: () => (this.wordNode).firstChild,
      letter: () => (this.letterNode).innerText
    }
  }

  document.addEventListener('keydown', (event) => {

  if ((event.key === ' ') && (letterNode === wordNode.lastChild)) {
    console.log('space key and last word letter')

    // move cursor upfront by 1 character
    let letterBound = letterNode.getBoundingClientRect()
    let cursorX = changeCursorX(letterBound.x, 20) // get future Cursor position
    console.log(cursorX, '" "')
    cursor.style.left = cursorX

    // prepare letter for next check
    wordNode = wordNode.nextElementSibling
    letterNode = wordNode.firstChild
    letter = letterNode.innerText

  } else if (event.key === letter) {
    console.log(event.key, letter)

    // move cursor upfront by 1 character
    let letterBound = letterNode.getBoundingClientRect()
    let cursorX = changeCursorX(letterBound.x, letterBound.width) // get future Cursor position
    cursor.style.left = cursorX // move cursor to new position
    console.log(cursorX, 'key=letter')

    letterNode.style.color = 'green'
    // prepare letter for next check
    if (letterNode.nextSibling) {
      letterNode = letterNode.nextSibling
      letter = letterNode.innerText
    } else {
      // fix backspace jumping per two chars
      //
      letter = ' '
    }
  } else if (specialKeys.some(item => event.key === item)) {
    return
  } else if (event.key == 'Backspace') {
    console.log(`Event:${event.key} & letter:${letter}`)

    if (letterNode.previousSibling) {
      // move cursor back by 1 character
      let letterBound = letterNode.getBoundingClientRect()
      //! letterBound value should be hardcoded 12
      let cursorX = changeCursorX(letterBound.x, -12) // get future Cursor position
      cursor.style.left = cursorX // move cursor to new position
      console.log('1', cursorX)
      // prepare letter for next check

      letterNode = letterNode.previousSibling
      letter = letterNode.innerText
      letterNode.style.color = 'black'
    } else {
      // move cursor back by 1 character
      let letterBound = letterNode.getBoundingClientRect()
      let cursorX = changeCursorX(letterBound.x, 0) // get future Cursor position
      cursor.style.left = cursorX // move cursor to new position
      console.log('3', cursorX)
      letterNode.style.color = 'black'
      // prepare letter for next check

    }
  } else {
    console.log(`letter ${event.key} and ${letter} don't match`)

    // move cursor upfront by 1 character
    let letterBound = letterNode.getBoundingClientRect()
    let cursorX = changeCursorX(letterBound.x, letterBound.width) // get future Cursor position
    cursor.style.left = cursorX // move cursor to new position
    console.log(cursorX, 'red')

    letterNode.style.color = 'red'
    // prepare letter for next check
    if (letterNode.nextSibling) {
    letterNode = letterNode.nextSibling
      letter = letterNode.innerText
    }
  }

    // if (event.key == letter) {
    //   console.log(`Event:${event.key} & letter:${letter} match`)
    //   oldNum = num
    //   num++

    //   letter = letterNodes[num].innerText
    //   letterNodes[oldNum].style.color = 'green'
    //   cursor.style.left = newCursorPos(letterNodes[num])

    // } else if (event.key == 'Backspace') {
    //   console.log(`Event:${event.key} & letter:${letter}`)
    //   // oldNum = num
    //   num = num > 0 ? num - 1 : 0

    //   letter = letterNodes[num].innerText
    //   letterNodes[num].style.color = 'black'
    //   cursor.style.left = newCursorPos(letterNodes[num])

    // } else if (specialKeys.some(item => event.key === item)) {
    //   console.log(`Event:${event.key} & letter:${letter}`)
    //   return

    // } else {
    //   console.log(`letter ${event.key} and ${letter} don't match`)
    //   oldNum = num
    //   num++
    //   letter = letterNodes[num].innerText
    //   cursor.style.left = newCursorPos(letterNodes[num])
    //   letterNodes[oldNum].style.color = 'red'
    // }
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
  window.addEventListener('resize', initCursor)
  // window.addEventListener('resize', initCursor)
  buildDivFromWords(words)
  keyPress()
}

document.addEventListener('DOMContentLoaded', () => {
  initTouchTyping()
})

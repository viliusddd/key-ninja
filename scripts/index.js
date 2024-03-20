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
      letterElement.innerText = letter

      wordElement?.appendChild(letterElement);
    })

    wordsDiv?.appendChild(wordElement);
  })
}

async function keyPress() {
  const cursor = document.getElementById('cursor')
  const cursorBound = cursor.getBoundingClientRect()
  cursor.style.left = cursorBound.x + 3.5 + 'px'

  for (const word of document.getElementById('words').childNodes) {
    for (const letter of word.childNodes) {
      const letterBound = letter.getBoundingClientRect()

      await new Promise(r => setTimeout(r, 1000))

      cursor.style.left = letterBound.x + 'px'
    }
  }
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
  moveCursor()
  document.addEventListener('keydown', keyPress())
}

document.addEventListener('DOMContentLoaded', () => {
  initTouchTyping()
})

import {apiUrl, specialKeys} from "./consts.js"
import {getApiJson, buildDivFromWords, convertJsonToWords} from "./utils.js"

class Key {
  constructor(event) {
    this._event = event;
    let cursor;
    let activeWord;
    let letterNode;
    let letter;
    let letters;
    this.initKey();
  }

  get event() {
    return this._event
  }
  wordIsCorrect() {
    return this.letterNodes.every(node => node.classList.contains('correct'))
  }
  goToNextWord() {
    if (!this.wordIsCorrect()) {
      console.log('yes>')
      this.activeWord.classList.add('error')
    }
    console.log('asdf')

    this.activeWord.classList.remove('active')

    this.activeWord = this.activeWord.nextSibling
    this.activeWord.classList.add('active')
    this.initKey()
    const cursorX = changeCursorX(this.letterNode.getBoundingClientRect(), 0)

    const nextCursorX = this.isLastInRow(cursorX)
    console.log(nextCursorX)
    if (nextCursorX) {
      console.log('go to next row')
      this.cursor.style.left = nextCursorX + 'px'
      this.goToNextRow()
    } else {
      this.cursor.style.left = cursorX + 'px'
    }
  }
  isFirstLetter() {
    return this.letterNode
      ? this.letterNode.isSameNode(this.activeWord.firstChild)
      : false
  }
  goToNextRow() {
    const wordsNode = document.getElementById('words')
    const wordsBound = wordsNode.getBoundingClientRect()
    const letterBound = this.letterNode.getBoundingClientRect()
    const wordsY = wordsBound.y - letterBound.height - 12 + 'px'
    words.style.top = wordsY
  }
  isLastInRow(cursorX) {
    console.log('>>', this.letter)
    const nextCursorX = changeCursorX(
      this.activeWord.previousSibling.lastChild.getBoundingClientRect(), 0
      // this.letterNode.nextSibling.getBoundingClientRect(), 0
    )
    console.log(cursorX, nextCursorX)

    return (cursorX < nextCursorX) ? cursorX : null
  }
  getWordsEdge() {
    const wrapper = document.getElementById('wordsWrapper')
    console.log('>', wrapper)
    const wrapperBB = wrapper.getBoundingClientRect()
    return wrapperBB.x + wrapperBB.width
  }
  appendLetter() {
    if (this.activeWord.querySelectorAll('.extra').length === 5) {
      return
    }

    let cursorX = changeCursorX(this.activeWord.lastChild.getBoundingClientRect(), 24)
    if (cursorX > this.getWordsEdge()) {
      return
    }

    const div = document.createElement('div')
    div.classList.add('letter', 'incorrect', 'extra')
    div.innerText = this.event.key
    this.activeWord.appendChild(div)

    cursorX = changeCursorX(this.activeWord.lastChild.getBoundingClientRect())
    this.cursor.style.left = cursorX + 'px'
  }
  initKey() {
    this.cursor = document.getElementById('cursor')
    this.activeWord = document.querySelector('.active')
    this.letterNodes = [...this.activeWord.children]
    this.letterNode = this.letterNodes.find(word => word.classList.length === 1)
    this.letter = this.letterNode ? this.letterNode.innerText : undefined
  }
  prev() {
    if (!this.letterNode) {
      if (this.activeWord.lastChild.classList.contains('extra')) {
        this.activeWord.lastChild.remove()

        const cursorX = changeCursorX(this.activeWord.lastChild.getBoundingClientRect())
        console.log(cursorX)

        this.cursor.style.left = cursorX + 'px'
        return
      } else {
      console.log(`>> inside: ${this.letterNode}`)
      // this.letterNode = this.activeWord.lastChild
      const cursorX = changeCursorX(this.activeWord.lastChild.getBoundingClientRect(), 0)

      this.activeWord.lastChild.classList.remove('incorrect', 'correct')
      this.cursor.style.left = cursorX + 'px'
      console.log(cursorX)
      return
      }
    }

    console.log(this.activeWord)
    console.log(this.letterNode, this.activeWord.firstChild)

    if (this.letterNode.isSameNode(this.activeWord.firstChild))
      return
    const cursorX = changeCursorX(this.letterNode.previousSibling.getBoundingClientRect(), 0)

    this.letterNode.previousSibling.classList.remove('incorrect', 'correct')
    this.cursor.style.left = cursorX + 'px'
  }
  next(correct) {
    const name = (correct === true) ? 'correct' : 'incorrect'

    if (!this.letterNode) {
      console.log(`${this.letter} is last in word`)
      if (!correct) this.appendLetter();
      return
    }

    const cursorX = changeCursorX(this.letterNode.getBoundingClientRect())

    this.letterNode.classList.add(name)
    this.cursor.style.left = cursorX + 'px'
  }
  status() {}
  stats() {}
}

function onKeyDown(evt) {
  const key = new Key(evt)

  console.log(evt.key)

  if (evt.key === ' ') {
    if (!key.isFirstLetter()) key.goToNextWord()
  } else if (evt.key === key.letter) {
    console.log(`${evt.key} match:`)
    key.next(true)
  } else if (evt.key === 'Backspace') {
    console.log(`${evt.key}:`)
    key.prev()
  } else if (specialKeys.some(item => evt.key === item)) {
    return
  } else {
    // key.nextIncorrect()
    key.next(false)
  }
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

export class Key {
  constructor(event) {
    this._event = event;
    // this.cursor = cursor;
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

  initKey() {
    this.cursor = document.getElementById('cursor')
    this.activeWord = document.querySelector('.active')
    this.letterNodes = [...this.activeWord.children]
    this.letterNode = this.letterNodes.find(word => word.classList.length === 1)
    this.letter = this.letterNode ? this.letterNode.innerText : undefined
  }

  /**
   * Undo character (Backspace event). There are 4 cases:
   * - remove "extra" letter after word
   * - undo last letter "space" that holds undefined value
   * - ignore if done at start of word
   * - undo the regular letter
   */
  prev() {
    if (this.activeWord.lastChild.classList.contains('extra')) {
      this.activeWord.lastChild.remove()
      this.cursor.style.left = changeCursorX(
        this.activeWord.lastChild.getBoundingClientRect()
      ) + 'px'
    } else if (!this.letterNode) {
      this.activeWord.lastChild.classList.remove('correct', 'incorrect')
      this.cursor.style.left = changeCursorX(
        this.activeWord.lastChild.getBoundingClientRect(), 0
      ) + 'px'
    } else if (this.letterNode.isSameNode(this.activeWord.firstChild)) {
      return
    } else {
      this.letterNode.previousSibling.classList.remove('correct', 'incorrect')
      this.cursor.style.left = changeCursorX(
        this.letterNode.previousSibling.getBoundingClientRect(), 0
      ) + 'px'
      }
  }

  /**
   * Enter a letter. It can be 3 cases:
   * - the last "space" letter, that holds undefined value:
   *   - if the letter is incorrect - append it to word end.
   *     Oherwise ignore it.
   * - correct letter.
   * @param {boolean} correct - true when match event.key.
   */
  next(correct) {
    const name = (correct === true) ? 'correct' : 'incorrect'

    if (!this.letterNode) {
      if (!correct) this.appendLetter();
    } else {
      this.letterNode.classList.add(name)
      this.cursor.style.left = changeCursorX(
        this.letterNode.getBoundingClientRect()
      ) + 'px'
    }

  }

  wordIsCorrect() {
    return this.letterNodes.every(node => node.classList.contains('correct'))
  }
  goToNextWord() {
    if (!this.wordIsCorrect()) {
      this.activeWord.classList.add('error')
    }

    this.activeWord.classList.remove('active')

    this.activeWord = this.activeWord.nextSibling
    this.activeWord.classList.add('active')
    this.initKey()
    const cursorX = changeCursorX(this.letterNode.getBoundingClientRect(), 0)

    const nextCursorX = this.isLastInRow(cursorX)

    if (nextCursorX) {
      // go to next row
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
    const nextCursorX = changeCursorX(
      this.activeWord.previousSibling.lastChild.getBoundingClientRect(), 0
      // this.letterNode.nextSibling.getBoundingClientRect(), 0
    )

    return (cursorX < nextCursorX) ? cursorX : null
  }
  getWordsEdge() {
    const wrapper = document.getElementById('wordsWrapper')
    const wrapperBB = wrapper.getBoundingClientRect()
    return wrapperBB.x + wrapperBB.width
  }
  appendLetter() {
    if (this.activeWord.querySelectorAll('.extra').length === 5) {
      return
    }

    let cursorX = changeCursorX(
      this.activeWord.lastChild.getBoundingClientRect(), 24
    )
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

  status() {}
  stats() {}
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

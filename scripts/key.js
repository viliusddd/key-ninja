/**
 * Checks if user input matches letters and goes back and forth the words.
 */
export default class Key {
  /**
   * @param {KeyboardEvent} event - coming from 'keydown' eventListener.
   * @param {Cursor} cursor - Cursor object responsible of moving text
   * insertion indication cursor horizontally.
   */
  constructor(event, cursor) {
    this._event = event;
    this._cursor = cursor;
    this.initKey();
  }

  get event() {
    return this._event
  }

  get cursor() {
    return this._cursor
  }

  initKey() {
    /** @type {Element} */
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
      this.cursor.move(this.activeWord.lastChild)
    } else if (!this.letterNode) {
      this.activeWord.lastChild.classList.remove('correct', 'incorrect')
      this.cursor.move(this.activeWord.lastChild, 0)
    } else if (this.letterNode.isSameNode(this.activeWord.firstChild)) {
      return
    } else {
      this.letterNode.previousSibling.classList.remove('correct', 'incorrect')
      this.cursor.move(this.letterNode.previousSibling, 0)
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
      this.cursor.move(this.letterNode)
    }
  }

  /**
   * Go to next word element:
   * - if word have issues - mark it with .error class
   * - move .active class from current to next word
   * - adjust cursor to new coordinates
   * - if next word is on the other line, then asjusts the row also
   */
  nextWord() {
    if (!this.wordIsCorrect()) this.activeWord.classList.add('error')

    this.activeWord.classList.remove('active')
    const prevCursorX = this.cursor.newCoord(this.activeWord.lastChild, 0)

    this.activeWord = this.activeWord.nextSibling //! at the end of tex is undefined?
    this.activeWord.classList.add('active')

    this.initKey()

    const currentCursorX = this.cursor.newCoord(this.letterNode, 0)

    this.cursor.move(this.letterNode, 0)

    if (prevCursorX > currentCursorX) {
      const siblings = this.getPreviousSiblings(this.activeWord)
      siblings.forEach(sibling => sibling.classList.add('hidden'))
    }
  }

  getPreviousSiblings(element) {
    const siblings = []
    while (element = element.previousSibling) siblings.push(element)
    return siblings
  }

  isFirstWordLetter() {
    return this.letterNode
      ? this.letterNode.isSameNode(this.activeWord.firstChild)
      : false
  }

  wordIsCorrect() {
    return this.letterNodes.every(node => node.classList.contains('correct'))
  }

  /**
   * Create new html div element for letter and append it to word, but:
   * - there can't be more than 5 "extra" appended letters
   * - it can't go beyond the edge of wordsWrapper
   */
  appendLetter() {
    let cursorX = this.cursor.newCoord(this.activeWord.lastChild, 24)
    const wwBBox = this.cursor.getBBox(document.getElementById('wordsWrapper'))

    if (cursorX > (wwBBox.x + wwBBox.width)) return
    if (this.activeWord.querySelectorAll('.extra').length === 5) return

    const div = document.createElement('div')
    div.classList.add('letter', 'incorrect', 'extra')
    div.innerText = this.event.key
    this.activeWord.appendChild(div)

    this.cursor.move(this.activeWord.lastChild)
  }
}

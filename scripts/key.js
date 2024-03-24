export class Key {
  constructor(event, cursor) {
    this._event = event;
    this.cursor = cursor;
    this.initKey();
  }

  get event() {
    return this._event
  }

  initKey() {
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

  wordIsCorrect() {
    return this.letterNodes.every(node => node.classList.contains('correct'))
  }

  goToNextWord() {
    if (!this.wordIsCorrect()) this.activeWord.classList.add('error')

    this.activeWord.classList.remove('active')
    const prevCursorX  = this.cursor.newCoord(this.activeWord.lastChild, 0)

    this.activeWord = this.activeWord.nextSibling
    this.activeWord.classList.add('active')

    this.initKey()

    const currentCursorX = this.cursor.newCoord(this.letterNode, 0)

    this.cursor.move(this.letterNode, 0)
    if (prevCursorX > currentCursorX) this.goToNextRow()
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

  getWordsEdge() {
    const wrapper = document.getElementById('wordsWrapper')
    const wrapperBB = wrapper.getBoundingClientRect()
    return wrapperBB.x + wrapperBB.width
  }

  appendLetter() {
    if (this.activeWord.querySelectorAll('.extra').length === 5) return

    let cursorX = this.cursor.newCoord(this.activeWord.lastChild, 24)
    if (cursorX > this.getWordsEdge()) return

    const div = document.createElement('div')
    div.classList.add('letter', 'incorrect', 'extra')
    div.innerText = this.event.key
    this.activeWord.appendChild(div)

    this.cursor.move(this.activeWord.lastChild)
  }

  status() {}

  stats() {}
}

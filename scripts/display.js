import { apiUrl } from "./config.js"
import { remCls } from "./utils.js"

export default class Display {
  constructor(displayElement, cursor) {
    /** @type {Element} */
    this.displayElement = displayElement
    // this.cursor = cursor
    /** @type {Cursor} */
    this.cursor = cursor
  }

  async create() {
    const url = this.constructUrl(apiUrl, 154)
    const apiJson = await this.getApiJson(url)
    const words = this.convertJsonToWords(apiJson)
    this.buildWords(words)
  }

  restart() {
    console.log('restart display')
    const resetElement = this.displayElement.querySelector('.reset')

    const counter = this.displayElement.querySelector('.counter')
    console.log(counter)
    // counter.innerText = 60
    this.remElements('.extra')
    this.displayElement.querySelectorAll('.letter').forEach(el => el.className = 'letter')
    this.displayElement.querySelectorAll('.word').forEach(elm => elm.className = 'word')
    this.cursor.move(this.displayElement, 0)
  }

  remElements(query) {
    const elements = this.displayElement.querySelectorAll(query)
    elements.forEach(el => el.remove())
  }

  reset() {
    console.log('reset display')
    this.restart()
  }

  /**
   * Convert api response json to array of strings.
   * @param {object} responseJson - json response from api
   * @return {string[]}
   */
  constructUrl(url, entries) {
    const randInt = Math.floor(Math.random() * entries) + 1
    return `${url} ${randInt}`
  }

  convertJsonToWords(apiJson) {
    const lines = apiJson[0].lines
    return lines
      .reduce((accum, line) => `${accum} ${line}`, '')
      .trim()
      .split(' ')
      .filter(word => word)
  }

  /**
   * @param {string} url
   * @return {Promise<string>}
   */
  async getApiJson(url) {
    try {
      const response = await fetch(url)
      return await response.json()
    } catch (error) {
      console.log(error)
    }
  }

  buildWords(words) {
    const wordsDiv = this.displayElement.querySelector('.words')

    words.forEach(word => {
      const wordElement = document.createElement('div')
      wordElement.className = 'word';

      [...word].forEach(letter => {
        const letterElement = document.createElement('div')
        letterElement.className = 'letter'
        letterElement.innerText = letter

        wordElement.appendChild(letterElement);
      })

      wordsDiv.appendChild(wordElement);
      wordsDiv.querySelector('.word').classList.add('active')
    })
  }
}

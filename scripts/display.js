import { apiUrl } from "./config.js"

export default class Display {
  constructor(displayElement) {
    this.displayElement = displayElement
  }

  /**
   * Convert api response json to array of strings.
   * @param {object} responseJson - json response from api
   * @return {string[]}
   */
  async convertJsonToWords() {
    const apiJson = await this.getApiJson(apiUrl)
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

  async buildWords() {
    const words = await this.convertJsonToWords()
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

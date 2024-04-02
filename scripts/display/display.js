import { apiUrl, timerTime } from "../config.js"

let CURRENT_API_URL = ''

export default class Display {
  constructor(appElement) {
    this.appElement = appElement
    this.displayElement = appElement.firstElementChild

    this.create()
  }

  async create(url = null) {
    if (!url) url = this.constructUrl(apiUrl, 154)

    const apiJson = await this.getApiJson(url)
    const words = this.convertJsonToWords(apiJson)

    this.buildWords(words)
    this.setTimerElement(timerTime)
    CURRENT_API_URL = url
  }

  resetDisplay() {
    // Remove old .word elements
    this.displayElement.querySelector('.words').replaceChildren()

    this.appElement.classList.remove('runs', 'finished')

    const timerElement = this.appElement.querySelector('.timer')
    timerElement.innerText = timerTime
  }

  resetChart() {
    this.appElement.querySelector('.chart').className = 'chart hidden'

    let chartStatus = Chart.getChart("chart")
    if (chartStatus != undefined) {
      chartStatus.destroy()
    }
  }

  restart(reset = null) {
    this.resetDisplay()
    this.resetChart()

    if (reset) {
      this.create()
    } else {
      this.create(CURRENT_API_URL)
    }
  }

  remElements(query) {
    const elements = this.displayElement.querySelectorAll(query)
    elements.forEach(el => el.remove())
  }

  setTimerElement(time) {
    this.appElement.querySelector('.timer').innerText = time
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

  timer(appElement) {
    const timerElement = appElement.querySelector('.timer')
    let count = timerTime
    count--

    let timer = setInterval(() => {
      timerElement.innerText = count--

      if (count < 0) {
        appElement.classList.remove('runs')
        appElement.classList.add('finished')
      }
      if (!appElement.classList.contains('runs')) {
        clearInterval(timer)
      }

    }, 1000)
  }
}


import { apiUrl, timerTime } from "../config.js"

let CURRENT_API_URL = ''
let RESTART = false

export default class Display {
  constructor(appElement, stats) {
    this.appElement = appElement
    this.displayElement = appElement.firstElementChild
    this.timerElement = appElement.querySelector('.timer')
    this.stats = stats

    this.create()
  }

  async create(url = null) {
    if (!url) url = this.constructUrl(apiUrl, 154)

    const apiJson = await this.getApiJson(url)
    const words = this.convertJsonToWords(apiJson)

    this.buildWords(words)
    this.updateTimerElement(timerTime)
    CURRENT_API_URL = url
  }

  /**
   * @param {number} time - number in seconds.
   */
  updateTimerElement(time) {
    this.timerElement.innerText = `${time}s`
  }

  resetDisplay() {
    // Remove old .word elements
    this.displayElement.querySelector('.words').replaceChildren()
    this.appElement.classList.remove('runs', 'finished')

  }

  resetChart() {
    let chartStatus = Chart.getChart("chart")
    if (chartStatus != undefined) {
      chartStatus.destroy()
    }
  }

  restart(reset = null) {
    RESTART = true

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
    let timer = timerTime
    let timeElapsed = 0

    const timerInterval = setInterval(() => {
      timer--
      timeElapsed++

      this.updateTimerElement(timer)
      this.stats.refresh(timeElapsed)

      if ((timer == 0) || RESTART) {
        if (!RESTART) {
          this.stats.storeResult()
          this.stats.chart()
          console.log('stop app')
        }

        clearInterval(timerInterval)

        appElement.className = 'app finished'

        RESTART = false

        return
      }
    }, 1000)
  }
}

import {apiUrl, timerTime} from './config.js'
import {appMsg, getApiJson} from './utils.js'

let CURRENT_API_URL = '';

/**
 * Performs operations on a field that displays words and
 * stats below it.
 */
export default class Display {
  /**
   * @param {Element} appElement - root element of the application
   * @param {Stats} stats - Stats class instance
   */
  constructor(appElement, stats) {
    this.appElement = appElement
    this.displayElement = appElement.firstElementChild
    this.timerElement = appElement.querySelector('.timer')
    this.msgElement = appElement.querySelector('.message')
    this.stats = stats

    this.create()
  }

  /**
   * Gets text from api url, processes it,creates html elements
   * from it and updates timer element.
   * @param {string=} url - api url from where the text is taken from
   */
  async create(url = null) {
    if (!url) url = this.constructUrl(apiUrl, 154)

    const apiJson = await getApiJson(url, this.msgElement)
    if (!apiJson) return

    const words = this.convertJsonToWords(apiJson)

    this.buildWords(words)
    this.updateTimerElement(timerTime)

    appMsg(this.msgElement).start()

    CURRENT_API_URL = url
  }

  /**
   * Set initial .timer element value.
   * @param {number} time - number in seconds.
   */
  updateTimerElement(time) {
    this.timerElement.innerText = `${time}s`
  }

  /** Reset WPN and Accuracy to their initial values */
  resetStatsElements() {
    this.stats.accElement.innerText = 0
    this.stats.wpmElement.innerText = 0
  }

  /** Remove .word elements, remove .finished & .runs from appElement */
  resetDisplay() {
    this.displayElement.querySelector('.words').replaceChildren()
    this.appElement.classList.remove('finished', 'runs')
  }

  /** Remove chart if it already exists */
  resetChart() {
    const chartStatus = Chart.getChart('chart')
    if (chartStatus != undefined) {
      chartStatus.destroy()
    }
  }

  /**
   * Restart or reset the app.
   * If restart is triggered while timer isn't finished - mark as cancel.
   * @param {boolean} reset - if the value is positive - change
   * the api url, otherwise leave  the current one.
   */
  restart(reset = false) {
    if (this.timerElement.innerText !== '0s') {
      this.appElement.classList.add('cancel')
    }

    this.resetDisplay()
    this.resetChart()
    this.resetStatsElements()

    if (reset) {
      this.create()
    } else {
      this.create(CURRENT_API_URL)
    }
  }

  /**
   * Construct url for random Shakespeare Sonnet.
   * @param {string} url - api url from config.js.
   * @param {number} entries - number of Shakespeare Sonnets to choose from.
   * @return {string}
   */
  constructUrl(url, entries) {
    const randInt = Math.floor(Math.random() * entries) + 1
    return `${url} ${randInt}`
  }

  /**
   * Create single string containing multiple words from api json output.
   * @param {object[]} apiJson - array with obejct from api.
   * @return {string[]} - array of words
   */
  convertJsonToWords(apiJson) {
    const lines = apiJson[0].lines
    return lines
        .reduce((accum, line) => `${accum} ${line}`, '')
        .trim()
        .split(' ')
        .filter(word => word)
  }

  /**
   * Create div element for each word and letter in it.
   * Mark 1st word as active.
   * @param {string[]} words - array of words.
   */
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

  /**
   * Counts seconds backwards from time supplied in config.
   * It also counts elapsed time to aid in calculating the wpm which is
   * shown during touch-typing exercise.
   * Timer stops when either:
   *   - .app element contains .cancel;
   *   - .app element contains .restart;
   *   - timer runs out of time. Only in this case the chart is shown.
   * @param {Element} appElement - root app element.
   */
  timer(appElement) {
    let timer = timerTime
    let timeElapsed = 0

    const timerInterval = setInterval(() => {
      timer--
      timeElapsed++

      if (this.appElement.classList.contains('cancel')) {
        this.appElement.classList.remove('runs', 'cancel')
        clearInterval(timerInterval)
        return
      } else if (this.appElement.classList.contains('restart')) {
        this.appElement.classList.remove('runs', 'restart')
        clearInterval(timerInterval)
        return
      } else if (timer === 0) {
        this.stats.storeResult()
        this.stats.chart()

        clearInterval(timerInterval)
        this.appElement.classList.remove('runs')
        appElement.classList.add('finished')
      }
      this.updateTimerElement(timer)
      this.stats.refresh(timeElapsed)
    }, 1000)
  }
}

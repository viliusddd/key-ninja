export default class Stats {
  constructor(appElement) {
    this.appElement = appElement
    this.statsElement = appElement.querySelector('.stats')
    this.wordsElement = appElement.querySelector('.words')
  }

  drawGraph() { }

  storeResult() {
    const match = { wpm: this.statsElement.querySelector('.wpm > div:last-child').innerText }

    let matches = this.retrieveResults()

    if (!matches) matches = []

    matches.push(match)

    window.localStorage.setItem('matches', JSON.stringify(match))
  }

  retrieveResults() {
    return JSON.parse(window.localStorage.getItem('matches'))
  }

  /**
   * Get total typed words, words with errors,
   * total letters and letters with errors.
   * @return {object}
   */
  typingStats() {
    // get all words before active word
    const siblings = []
    let element = this.wordsElement.querySelector('.active')
    if (!element) return

    while (element = element.previousSibling) siblings.push(element)

    let ltrTotal = 0
    let ltrCorrect = 0

    for (const word of siblings) {
      //count " " after word
      if (!word.classList.contains('error')) ltrTotal++, ltrCorrect++

      for (const letter of word.childNodes) {
        ltrTotal++
        if (letter.classList.contains('correct')) ltrCorrect++
      }
    }

    const wrdTotal = siblings.length
    const wrdCorrect = siblings
      .filter(sib => !sib.classList.contains('error'))
      .reduce((accum, _) => accum += 1, 0)

    console.log(ltrTotal, ltrCorrect, wrdTotal, wrdCorrect)
    return { ltrTotal, ltrCorrect, wrdTotal, wrdCorrect, }
  }

  toFixedWithoutZeros(num, precision = 1) {
    return `${Number.parseFloat(num.toFixed(precision))}`;
  }

  /** Refresh WPM and Accuracy statistics every second */
  refreshStats() {
    let timeElapsed = 0

    let statsRefresh = setInterval(() => {
      if (!this.appElement.classList.contains('runs')) return

      timeElapsed++
      const stats = this.typingStats()

      const wpm = Math.round(stats.ltrTotal / 5 / timeElapsed * 60);
      const accuracy = stats.ltrCorrect / stats.ltrTotal * 100

      const wpmElement = this.appElement.querySelector('.wpm > div:last-child')
      const accElement = this.appElement
        .querySelector('.accuracy > div > div:first-child')

      if (wpm) wpmElement.innerText = wpm
      if (accuracy) accElement.innerText = this.toFixedWithoutZeros(accuracy)

      const timerElement = this.appElement.querySelector('.timer')
      if (timerElement.innerText === '0') clearInterval(statsRefresh)
    }, 1000)
  }
}

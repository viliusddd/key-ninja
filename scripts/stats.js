import {dateTimeNow, toFixedWithoutZeros, retrieveLocalItem} from './utils.js'
/**
 * Deals with the display of statistics.
 */
export default class Stats {
  /**
   * @param {Element} appElement - root element of application.
   */
  constructor(appElement) {
    this.appElement = appElement
    this.statsElement = appElement.querySelector('.stats')
    this.wordsElement = appElement.querySelector('.words')
    this.accElement = appElement.querySelector('.accuracy > div > div')
    this.wpmElement = appElement.querySelector('.wpm > div:last-child')
  }

  /**
   * Accumulate statistics of each run of touch-typing exercise.
   * Each touch-type exercise stats are acuumulated every second of the
   * exercise to sessionStorage.
   * Here it appends final stats of exercise to localStorage for
   * convenient way of retrieving history of exercises for chart.
   */
  storeResult() {
    const match = JSON.parse(sessionStorage.getItem('stats'))

    let matches = retrieveLocalItem('matches')
    if (matches) matches = matches.slice(-19)

    if (!matches) {
      matches = [match]
    }

    matches.push(match)

    window.localStorage.setItem('matches', JSON.stringify(matches))
  }

  /**
   * Get multiple statistics exercise.
   * @param {number} timeElapsed - elapsed time since exercise start.
   * @return {object} - example: {
   *   "date": "2024-04-03 13:02",
   *   "wpm": 72,
   *   "accuracy": 100,
   *   "keystrokes":30,
   *   "correctWords": 6,
   *   "wrongWords": 0,
   *   "corrections": 0
   * }
   */
  typingStats(timeElapsed = null) {
    // get all words before active word
    const siblings = []
    let activeElement = this.wordsElement.querySelector('.active')
    if (!activeElement) return

    while (activeElement = activeElement.previousSibling) {
      siblings.push(activeElement)
    }

    let keystrokes = 0
    let keysCorrect = 0

    /** count " " after words */
    for (const word of siblings) {
      if (!word.classList.contains('error')) keystrokes++, keysCorrect++

      for (const letter of word.childNodes) {
        keystrokes++
        if (letter.classList.contains('correct')) keysCorrect++
      }
    }

    const wrdTotal = siblings.length

    const correctWords = siblings
        .filter(sib => !sib.classList.contains('error'))
        .reduce((accum, _) => accum += 1, 0)

    let accuracy = 0
    if (keystrokes > 0) {
      accuracy = toFixedWithoutZeros(keysCorrect / keystrokes * 100)
    }

    const stats = {
      date: dateTimeNow(),
      wpm: Math.round(keystrokes / 5 / timeElapsed * 60),
      accuracy,
      keystrokes,
      correctWords,
      wrongWords: wrdTotal - correctWords,
      corrections: parseInt(sessionStorage.getItem('corrections')),
    }

    sessionStorage.setItem('stats', JSON.stringify(stats))
    return stats
  }

  /**
   * Update WPM and Accuracy elements.
   * @param {number} timeElapsed - elapsed time since start of exercise.
   */
  refresh(timeElapsed) {
    const typingStats = this.typingStats(timeElapsed)
    if (typingStats) {
      this.wpmElement.innerText = typingStats.wpm
      this.accElement.innerText = typingStats.accuracy
    }
  }

  /** Create new Chart. */
  chart() {
    const matches = retrieveLocalItem('matches')

    const borderColor = getComputedStyle(document.body)
        .getPropertyValue('--txt-stats')

    const data = {
      labels: matches.map(res => res.date),
      datasets: [{
        data: matches.map(res => res.wpm),
        fill: true,
        borderColor,
        borderWidth: 1,
      }],
    }

    const callbacks = {
      beforeTitle: context => {
        return `${matches[context[0].dataIndex].date}`
      },
      title: context => {
        return `${matches[context[0].dataIndex].wpm} WPM`
      },
      afterTitle: context => {
        return `${matches[context[0].dataIndex].accuracy}% accuracy`
      },
      label: context => {
        return [
          `${matches[context.dataIndex].keystrokes} keystrokes`,
          `${matches[context.dataIndex].correctWords} correct words`,
          `${matches[context.dataIndex].wrongWords} wrong words`,
          `${matches[context.dataIndex].corrections} corrections`,
        ]
      },
    }

    const config = {
      type: 'line',
      data,
      options: {
        responsive: true,
        legend: {display: false},
        scales: {
          y: {ticks: {min: 0, max: 100}},
          x: {ticks: {display: false}},
        },
        plugins: {
          legend: {display: false},
          tooltip: {
            displayColors: false,
            enabled: true,
            callbacks,
          },
        },
      },
    }

    new Chart('chart', config)
  }
}

export default class Stats {
  constructor(appElement) {
    this.appElement = appElement
    this.statsElement = appElement.querySelector('.stats')
    this.wordsElement = appElement.querySelector('.words')
  }

  storeSession(item) {
    const { itemKey, itemVal } = item
    sessionStorage.setItem({ itemKey, itemVal })
  }

  storeResult() {
    const wpm = this.statsElement.querySelector('.wpm > div:last-child').innerText
    const accuracy = this.statsElement.querySelector('.accuracy > div > div').innerText
    const date = Intl.DateTimeFormat("lt", {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())

    const match = JSON.parse(sessionStorage.getItem('stats'))

    let matches = this.retrieveItem('matches')
    if (matches) matches = matches.slice(-19)

    if (!matches) {
      matches = [match]
    }

    matches.push(match)

    window.localStorage.setItem('matches', JSON.stringify(matches))
  }

  retrieveItem(itemName) {
    if (localStorage.getItem(itemName)) {
      return JSON.parse(localStorage.getItem(itemName))
    }
  }

  dateTimeNow() {
    return Intl.DateTimeFormat("lt", {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date())
  }

  /**
   * Get total typed words, words with errors,
   * total letters and letters with errors.
   * @return {object}
   */
  typingStats(timeElapsed = null) {
    // get all words before active word
    const siblings = []
    let element = this.wordsElement.querySelector('.active')
    if (!element) return

    while (element = element.previousSibling) siblings.push(element)

    let keystrokes = 0
    let keysCorrect = 0

    for (const word of siblings) {
      //count " " after words
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
      accuracy = this.toFixedWithoutZeros(keysCorrect / keystrokes * 100)
    }

    const stats = {
      date: this.dateTimeNow(),
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

  toFixedWithoutZeros(num, precision = 1) {
    return Number.parseFloat(num.toFixed(precision));
  }

  refresh(timeElapsed) {
    const wpmElement = this.appElement.querySelector('.wpm > div:last-child')
    const accElement = this.appElement
      .querySelector('.accuracy > div > div:first-child')

    const typingStats = this.typingStats(timeElapsed)
    if (typingStats) {
      wpmElement.innerText = typingStats.wpm
      accElement.innerText = typingStats.accuracy
    }
  }

  chart() {
    const matches = this.retrieveItem('matches')

    const data = {
      labels: matches.map(res => res.date),
      datasets: [{
        data: matches.map(res => res.wpm),
        fill: true,
        lineTension: 0,
        borderColor: "rgba(0,0,255,0.1)"
      }]
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
      type: "line",
      data,
      options: {
        responsive: true,
        legend: { display: false },
        scales: {
          y: { ticks: { min: 0, max: 100 } },
          x: { ticks: { display: false } }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            enabled: true,
            callbacks,
          },
        },
      }
    }

    new Chart("chart", config);
  }
}

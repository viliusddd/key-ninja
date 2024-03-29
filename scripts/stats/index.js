export default class Stats {
  constructor(appElement) {
    this.appElement = appElement
    this.statsElement = appElement.querySelector('.stats')
    this.wordsElement = appElement.querySelector('.words')
  }

  storeResult() {
    const date = new Date().toLocaleString();
    const wpm = this.statsElement.querySelector('.wpm > div:last-child').innerText
    const accuracy = this.statsElement.querySelector('.accuracy > div > div').innerText
    const match = { wpm, date, accuracy }

    let matches = this.retrieveItem('matches')
    if (matches) matches = matches.slice(-19)

    if (!matches) {
      matches = [match]
    }

    matches.push(match)

    window.localStorage.setItem('matches', JSON.stringify(matches))
  }

  retrieveItem(itemName) {
    if (window.localStorage.getItem(itemName)) {
      return JSON.parse(window.localStorage.getItem(itemName))
    }
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

  chart() {
    const matches = this.retrieveItem('matches')
    console.log(matches)

    new Chart("chart", {
      type: "line",
      data: {
        labels: matches.map(res => res.date),
        datasets: [{
          data: matches.map(res => res.wpm),
          fill: true,
          lineTension: 0,
          borderColor: "rgba(0,0,255,0.1)"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            enabled: true,
            callbacks: {
              beforeTitle: context => {
                return `${matches[context[0].dataIndex].date}`
              },
              title: context => {
                return `${matches[context[0].dataIndex].wpm} WPM`
              },
              label: context => {
                console.log(context)
                return `${matches[context.dataIndex].accuracy}% accuracy`
              }
            },
          },
        },
        legend: { display: false },
        scales: {
          y: { ticks: { min: 0, max: 100 } },
          x: { ticks: { display: false } }
        }
      }
    });
  }
}

export default (appElement) => {
  const runs = 'runs'
  const chart = appElement.querySelector('.chart')
  return {
    startApp: () => appElement.classList.add(runs),
    stopApp: () => appElement.classList.remove(runs),
    appRunning: () => appElement.classList.contains(runs),
    appFinished: () => appElement.classList.contains('finished'),
  }
}

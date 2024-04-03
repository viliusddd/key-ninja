export default (appElement) => {
  const runs = 'runs'
  return {
    startApp: () => appElement.classList.add(runs),
    stopApp: () => appElement.classList.remove(runs),
    appRunning: () => appElement.classList.contains(runs),
    appFinished: () => appElement.classList.contains('finished'),
  }
}

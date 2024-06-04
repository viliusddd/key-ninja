export default (appElement) => {
  const runs = 'runs'
  return {
    startApp: () => appElement.classList.add(runs),
    appRunning: () => appElement.classList.contains(runs),
    appFinished: () => appElement.classList.contains('finished'),
  }
}

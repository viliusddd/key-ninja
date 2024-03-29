export default (appElement) => {
  const runs = 'runs'
  return {
    startApp: () => appElement.classList.add(runs),
    stopApp: () => appElement.classList.remove(runs),
    appIsRunning: () => appElement.classList.contains(runs)
  }
}

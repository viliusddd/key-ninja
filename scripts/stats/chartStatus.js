export default (chartElement) => {
  return {
    chartDrawn: () => chartElement.classList.contains('chartUpdated'),
    chartToggle: () => {
      chartElement.classList.add('chartUpdated')
      chartElement.classList.remove('hidden')
    },
  }
}

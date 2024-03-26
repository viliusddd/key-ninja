/**
 * Moves text insertion indication cursor
 * (HTML div element) horizontally.
 */
export default class Cursor {
  #cursorElement

  constructor(appElement) {
    this.#cursorElement = appElement.querySelector('.cursor');
  }

  /**
   * Move cursor horizontally
   * @param {Element} element - HTML Element
   * @param {Number=} width - override value for bounding box width
   */
  move(element, width = null) {
    const pixels = this.newCoord(element, width)
    this.#cursorElement.style.left = `${pixels}px`
  }

  newCoord(element, width = null) {
    const bbox = this.getBBox(element)
    if (width === null) width = bbox.width;
    return bbox.x + width - 1
  }

  getBBox(element) {
    const { top, right, bottom, left, width, height, x, y } = element
      .getBoundingClientRect()
    return { top, right, bottom, left, width, height, x, y }
  }
}

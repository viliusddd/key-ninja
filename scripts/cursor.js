import {getBBox} from './utils.js'
/**
 * Moves text insertion indication cursor
 * (HTML div element) horizontally.
 */
export default class Cursor {
  /**
   * @param {Element} appElement - root application element.
   */
  constructor(appElement) {
    this.cursorElement = appElement.querySelector('.cursor');
    this.displayElement = appElement.querySelector('.display')
    this.reset()
  }

  /** Move cursor to the begining of line. */
  reset() {
    this.move(this.displayElement, 8)
  }

  /**
   * Move cursor horizontally
   * @param {Element} element - HTML Element
   * @param {Number=} width - override value for bounding box width
   */
  move(element, width = null) {
    const pixels = this.newCoord(element, width)
    this.cursorElement.style.left = `${pixels}px`
  }

  /**
   * Get coordinates for next cursor position.
   * @param {Element} element - html element
   * @param {number} width - optional override of element parameter width.
   * @return {number} - number for new cursor x coordinate.
   */
  newCoord(element, width = null) {
    const bbox = getBBox(element)
    if (width === null) width = bbox.width;
    return bbox.x + width - 1
  }
}

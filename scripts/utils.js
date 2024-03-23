/**
 * Remove all instances of class name from html document
 * @param {string} cls - css class name
 */
export function remCls(cls) {
  document
    .querySelectorAll(`.${cls}`)
    .forEach(node => node.classList.remove(cls))
}

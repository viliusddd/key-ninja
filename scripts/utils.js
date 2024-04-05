/**
 * Round number to precise decimal places. Do not add zeroes.
 * @param {number} num
 * @param {number} precision - how many numbers after comma.
 * @return {number}
 */
export function toFixedWithoutZeros(num, precision = 1) {
  return Number.parseFloat(num.toFixed(precision));
}

/**
 * Return current date and time in short LT form.
 * @return {string} - example: "2024-04-03 13:03"
 */
export function dateTimeNow() {
  return Intl.DateTimeFormat('lt', { // eslint-disable-line new-cap
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())
}

/**
 * Retrieve key value from localStorage.
 * @param {string} key - localStorage key name.
 * @return {object[]} - array containing separate object for each
 * completed touch-typing exercise.
 */
export function retrieveLocalItem(key) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key))
  }
}

/**
 * Get element's DOMRect object in a convenient form.
 * @param {Element} element - html element.
 * @return {Object} - object element bounding box numbers retrieved
 * from its DOMRect.
 */
export function getBBox(element) {
  const {top, right, bottom, left, width, height, x, y} = element
      .getBoundingClientRect()
  return {top, right, bottom, left, width, height, x, y}
}

/**
 * @param {string} url - url of api containing words for typing.
 * @param {Element} element - html element of .message div.
 * @return {Promise<object[]> | object}
 */
export async function getApiJson(url, element) {
  let response

  try {
    response = await fetch(url)

    if (!response.ok) {
      throw response
    }

    const respJson = await response.json()

    if (respJson.status == 404) {
      throw respJson
    } else {
      return respJson
    }
  } catch (err) {
    if (err.status) {
      element.innerText = `${err.status}: connection failed.`
    } else if (err.name) {
      element.innerText = `Fails with ${err.name}.`
    }

    element.classList.add('network-error')

    return
  }
}

/**
 * Change innerText of .message element.
 * @param {Element} element - html element.
 * @return {object}
 */
export function appMsg(element) {
  return {
    start: () => {
      element.innerText = 'Press any key to start'
      element.classList.add('pulse')
    },
    restart: () => {
      element.innerText = 'Press Esc or Enter to restart'
      element.classList.remove('pulse')
    },
  }
}

/**
 * Remove all instances of class name from html document
 * @param {string} cls - css class name
 */
export function remCls(cls) {
  document
    .querySelectorAll(`.${cls}`)
    .forEach(node => node.classList.remove(cls))
}

/**
 * Get and format api response to single string
 * @param {string} url api url
 * @return {Promise<string>}
 */
export async function getApiJson(url) {
  const response = await fetch(url)
  return await response.json()
}

/**
 * Convert api response json to array of strings.
 * @param {object} responseJson - json response from api
 * @return {string[]}
 */
export function convertJsonToWords(responseJson) {
  const lines = responseJson[0].lines

  const words = lines
    .reduce((accum, line) => `${accum} ${line}`, '')
    .trim()
    .split(' ')
    .filter(word => word)

  return words
}

export function buildDivFromWords(words) {
  const wordsDiv = document.querySelector('.words')

  words.forEach(word => {
    const wordElement = document.createElement('div')
    wordElement.className = 'word';

    [...word].forEach(ltr => {
      const letterElement = document.createElement('div')
      letterElement.className = 'letter'
      letterElement.innerText = ltr

      wordElement.appendChild(letterElement);
    })

    wordsDiv.appendChild(wordElement);
    document.querySelector('.word').classList.add('active')
  })
}

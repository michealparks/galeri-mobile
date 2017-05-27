import storage from '../util/storage'
import shuffle from '../util/shuffle'

export {restoreData, getCollection, getNextPages}

const museumData = (async function () {
  const configVersion = '0.0.1'
  const config = await storage('museums') || {}
  return config.version === configVersion ? config : {}
})()

function restoreData (types, artworks, nextPages, page, max) {
  for (let i = 0, l = types.length; i < l; ++i) {
    const [storeKey, dataKey] = types[i].split(':')
    const data = museumData[storeKey] || {}

    artworks[dataKey] = data.artworks || []

    if (nextPages) {
      nextPages[dataKey] = data.nextPages || []
    }

    if (page) {
      page[dataKey] = data.page || Math.ceil(Math.random() * max)
    }
  }
}

function getCollection (next, url, category, responseType) {
  const xhr = new XMLHttpRequest()
  const errHandler = onError.bind(xhr, next)

  xhr.open('GET', url, true)
  xhr.responseType = responseType || 'json'
  xhr.timeout = 10000
  xhr.onload = onLoad.bind(xhr, next, category)
  xhr.ontimeout = errHandler
  xhr.onerror = errHandler
  xhr.send()
}

function getNextPages (currentPage, totalPages, startPage) {
  const nextPages = []

  for (let i = startPage || 0; i < totalPages; ++i) {
    if (i !== currentPage) nextPages.push(i)
  }

  shuffle(nextPages)

  return nextPages
}

function onLoad (next, category) {
  if (this.status !== 200) {
    return next(1)
  }

  next(undefined, this.response, category)
}

function onError (next, e) {
  next(1)
}

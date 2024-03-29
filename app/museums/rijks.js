import {rijksKey} from './api-keys'
import {isNullUndefined} from '../util/index'
import shuffle from '../util/shuffle'
import {screenWidth, screenHeight} from '../util/screen'
import {restoreData, getCollection, getNextPages} from './helpers'

export default {getNextArtwork, getConfig}

let callbackRef

const nextPages = {}
const page = {}
const artworks = {}
const perPage = 30

restoreData([
  'rijks_painting:type=painting',
  'rijks_drawing:material=paper&type=drawing&technique=brush'
], artworks, nextPages, page, 20)

function getNextArtwork (category, next) {
  let artwork

  while (artworks[category].length > 0) {
    const pending = artworks[category].pop()

    if (pending.naturalWidth >= screenWidth() &&
        pending.naturalHeight >= screenHeight()) {
      artwork = pending
      break
    }
  }

  if (artwork === undefined) {
    callbackRef = next
  } else {
    next(undefined, artwork)
    callbackRef = undefined
  }

  if (artwork === undefined || artworks[category].length === 0) {
    getCollection(onGetCollection, makeReqUrl(category), category)
  }
}

function getConfig (category) {
  return {
    artworks: artworks[category],
    nextPages: nextPages[category],
    page: page[category]
  }
}

function onGetCollection (err, response, category) {
  if (err !== undefined) {
    if (callbackRef) {
      callbackRef(err)
      callbackRef = undefined
    }
    return
  }

  for (let art, i = 0, r = response.artObjects || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (isNullUndefined(art.webImage) ||
        isNullUndefined(art.links)) continue

    const text = art.longTitle.split(',')

    artworks[category].push({
      source: 'Rijksmuseum',
      href: art.links.web,
      img: art.webImage.url,
      naturalWidth: art.webImage.width,
      naturalHeight: art.webImage.height,
      title: text[0],
      text: text.slice(1).join(', ')
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    nextPages[category] = getNextPages(page[category], response.count, perPage)
  }

  page[category] = nextPages[category].pop()

  if (callbackRef !== undefined) {
    getNextArtwork(category, callbackRef)
  }
}

function makeReqUrl (category) {
  return 'https://www.rijksmuseum.nl/api/en/collection' +
    '?key=' + rijksKey +
    '&format=json&ps=' + perPage +
    '&p=' + page[category] +
    '&imgonly=True&' + category
}

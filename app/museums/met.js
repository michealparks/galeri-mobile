import {isNullUndefined} from '../util/index'
import shuffle from '../util/shuffle'
import {restoreData, getCollection, getNextPages} from './helpers'

export default {getNextArtwork, getConfig}

let callbackRef

const perPage = 20
const nextPages = {}
const page = {}
const artworks = {}

restoreData([
  'met_acrylic:acrylic on canvas',
  'met_oil:oil on canvas',
  'met_ink:ink and color on paper'
], artworks, nextPages, page, 20)

function getNextArtwork (category, next) {
  const artwork = artworks[category].pop()

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
    if (callbackRef !== undefined) {
      callbackRef(err)
      callbackRef = undefined
    }
    return
  }

  for (let art, i = 0, r = response.results || [], l = r.length; i < l; ++i) {
    art = r[i]

    if (isNullUndefined(art.image) ||
        isNullUndefined(art.subTitle) ||
        art.image.indexOf('.ashx') > -1 ||
        art.image.indexOf('NoImageAvailableIcon.png') > -1) continue

    if (art.image.indexOf('http') === -1) {
      art.image = 'http://metmuseum.org/' + art.image
    }

    artworks[category].push({
      source: 'The Metropolitan Museum of Art',
      href: `https://metmuseum.org${art.url}`,
      title: art.title,
      text: art.subTitle,
      img: art.image.replace('web-thumb', 'original'),
      naturalWidth: 0,
      naturalHeight: 0
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    const totalPages = Math.ceil(response.totalResults / perPage)
    nextPages[category] = getNextPages(page[category], totalPages, 0)
  }

  page[category] = nextPages[category].pop()

  if (callbackRef !== undefined) {
    getNextArtwork(category, callbackRef)
  }
}

function makeReqUrl (category) {
  return 'https://metmuseum.org/api/collection/search' +
    '?q=' + encodeURIComponent(category) +
    '&perPage=' + perPage +
    '&page=' + page[category]
}

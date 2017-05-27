import shuffle from '../util/shuffle'
import {screenWidth} from '../util/screen'
import {restoreData, getCollection} from './helpers'

export default {getNextArtwork, getConfig}

var HTMLParser = require('fast-html-parser')

const pixelRegex = /[0-9]{3,4}px/
const parenRegex = / *\([^)]*\) */g
const artworks = {}

let callbackRef

restoreData(['wikipedia:Paintings'], artworks)

function getNextArtwork (category, next) {
  const artwork = artworks[category].pop()

  if (artwork === undefined) {
    callbackRef = next
  } else {
    artwork.img = artwork.img.replace(
      pixelRegex,
      `${Math.floor(screenWidth() + 500)}px`)
    next(undefined, artwork)
    callbackRef = undefined
  }

  if (artwork === undefined || artworks[category].length === 0) {
    getCollection(onGetCollection, makeReqUrl(category), category)
  }
}

function getConfig (category) {
  return {
    artworks: artworks[category]
  }
}

function onGetCollection (err, response, category) {
  if (err !== undefined) {
    if (callbackRef !== undefined) {
      getNextArtwork(category, callbackRef)
      callbackRef = undefined
    }
  }

  var html = HTMLParser.parse(response.parse.text['*'])
  const gallerytext = html.querySelectorAll('.gallerytext')
  const gallery = html.querySelector('.gallery')
  const list = gallery.querySelectorAll('img')

  for (let i = 0, l = list.length; i < l; ++i) {
    const a = gallerytext[i].querySelectorAll('a')

    artworks[category].push({
      source: 'Wikipedia',
      title: a[0].attributes.title.replace(parenRegex, ''),
      text: a[1] ? a[1].attributes.title.replace(parenRegex, '') : '',
      href: `https://wikipedia.org${a[0].attributes.href}`,
      img: `https:${list[i].attributes.src}`
    })
  }

  shuffle(artworks[category])

  if (callbackRef) {
    getNextArtwork(category, callbackRef)
    callbackRef = undefined
  }
}

function makeReqUrl (category) {
  return 'https://en.wikipedia.org/w/api.php' +
    '?action=parse&prop=text&page=Wikipedia:Featured%20pictures/Artwork/' +
    category + '&format=json&origin=*'
}

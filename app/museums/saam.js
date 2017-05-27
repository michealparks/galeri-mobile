import HTMLParser from 'fast-html-parser'
import shuffle from '../util/shuffle'
import {restoreData, getCollection, getNextPages} from './helpers'

export default {getNextArtwork, getConfig}

let callbackRef

const nextPages = {}
const page = {}
const artworks = {}
const perPage = 20

restoreData(['saam_painting:Painting'], artworks, nextPages, page, 20)

function getNextArtwork (category, next) {
  const artwork = artworks[category].pop()

  if (artwork === undefined) {
    callbackRef = next
  } else {
    next(undefined, artwork)
    callbackRef = undefined
  }

  if (artwork === undefined || artworks[category].length === 0) {
    getCollection(onGetCollection, makeReqUrl(category), category, 'text')
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
  if (err) {
    if (callbackRef) {
      callbackRef(err)
      callbackRef = undefined
    }
  }

  const html = HTMLParser.parse(response)
  const list = html
    .querySelector('#contentSearchListArtwork')
    .querySelectorAll('ul')[1]
    .querySelectorAll('li')

  for (let art, title, i = 0, r = list || [], l = r.length; i < l; ++i) {
    art = r[i]
    title = art
      .querySelector('.artworkDetails')
      .querySelector('h3')
      .querySelector('a')

    artworks[category].push({
      source: 'The Walters Art Museum',
      img: art.querySelector('img').rawAttributes.src.split('&')[0] +
        '?quality=100&format=jpg',
      title: title.rawText,
      text: art
        .querySelector('.artworkDetails')
        .querySelectorAll('span')
        .find(span => span.rawAttributes.title === 'artist').rawText,
      href: `https://americanart.si.edu${title.rawAttributes.href}`,
      naturalWidth: 0,
      naturalHeight: 0
    })
  }

  shuffle(artworks[category])

  if (nextPages[category].length === 0) {
    const count = Number(html
      .querySelector('#contentSearchListArtworkTitle')
      .querySelector('p')
      .rawText.trim().split(' ').pop())
    nextPages[category] = getNextPages(page[category], Math.ceil(count / perPage), perPage, 1)
  }

  page[category] = nextPages[category].pop()

  if (callbackRef !== undefined) {
    getNextArtwork(category, callbackRef)
  }
}

function makeReqUrl (category) {
  return 'https://americanart.si.edu/collections/search/artwork/results/index.cfm' +
    '?rows=' + perPage +
    '&fq=online_media_type:%22Images%22&q=' + category +
    '&page=' + page[category] +
    '&start=' + (perPage * page[category]) + '&x=57&y=8'
}

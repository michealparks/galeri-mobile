import {AppState} from 'react-native'
import Met from './met'
import Rijks from './rijks'
import Guggenheim from './guggenheim'
import Wikipedia from './wikipedia'
import SAAM from './saam'
import Walters from './walters'
import Harvard from './harvard'
import storage from '../util/storage'

export default getNextArtwork

AppState.addEventListener('change', (nextAppState) => {
  if (/inactive|background/.test(nextAppState)) saveConfig()
})

function getNextArtwork (next) {
  if (Math.floor(Math.random() * 8) === 0) {
    return getNextRareImage(next)
  }

  const n = Math.floor(Math.random() * 7)

  switch (n) {
    case 0: return Met.getNextArtwork('oil on canvas', next)
    case 1: return Met.getNextArtwork('acrylic on canvas', next)
    case 2: return Rijks.getNextArtwork('type=painting', next)
    case 3: return Wikipedia.getNextArtwork('Paintings', next)
    case 4: return Walters.getNextArtwork('classification=painting', next)
    case 5: return Harvard.getNextArtwork('Oil|Ink and color|Watercolor|Mixed media|Ink and opaque watercolor', next)
    case 6: return SAAM.getNextArtwork('Painting', next)
    default: next(1)
  }
}

function getNextRareImage (next) {
  const n = Math.floor(Math.random() * 4)

  switch (n) {
    case 0: return Guggenheim.getNextArtwork('painting', next)
    case 1: return Guggenheim.getNextArtwork('work-on-paper', next)
    case 2: return Met.getNextArtwork('ink and color on paper', next)
    case 3: return Rijks.getNextArtwork('material=paper&type=drawing&technique=brush', next)
    default: next(1)
  }
}

function saveConfig () {
  storage('museums', {
    version: '0.0.1',
    'met_oil': Met.getConfig('oil on canvas'),
    'met_acrylic': Met.getConfig('acrylic on canvas'),
    'met_ink': Met.getConfig('ink and color on paper'),
    'rijks_painting': Rijks.getConfig('type=painting'),
    'rijks_drawing': Rijks.getConfig('material=paper&type=drawing&technique=brush'),
    'guggenheim_painting': Guggenheim.getConfig('painting'),
    'guggenheim_paper': Guggenheim.getConfig('work-on-paper'),
    'wikipedia': Wikipedia.getConfig('Paintings')
  })
}

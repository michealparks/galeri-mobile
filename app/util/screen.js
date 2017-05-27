import {Dimensions} from 'react-native'

export {screenWidth, screenHeight}

function screenWidth () {
  const screen = Dimensions.get('window')

  return screen.width * screen.scale
}

function screenHeight () {
  const screen = Dimensions.get('window')

  return screen.height * screen.scale
}

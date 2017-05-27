import {AsyncStorage} from 'react-native'

export default storage

function storage (key, val) {
  return val !== undefined && val !== null
    ? AsyncStorage.setItem(key, JSON.stringify(val))
    : AsyncStorage.getItem(key).then(item => JSON.parse(item))
}

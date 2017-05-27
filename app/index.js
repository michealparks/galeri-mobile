import React, {PureComponent} from 'react'
import {Image} from 'react-native'
import BackgroundView from './renderer'
import getNextArtwork from './museums'
import {screenWidth, screenHeight} from './util/screen'

export default class App extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      uri: null,
      intervalTime: 1000 * 10
    }

    this.onGetArtwork = this.onGetArtwork.bind(this)
    this.onLoad = this.onLoad.bind(this)
    this.onError = this.onError.bind(this)
  }

  componentDidMount () {
    getNextArtwork(this.onGetArtwork)
  }

  onGetArtwork (err, data) {
    if (err !== undefined) {
      return getNextArtwork(this.onGetArtwork)
    }

    const uri = data.img.indexOf('metmuseum') > -1
      ? data.img
      : data.img.replace('http:', 'https:')

    Image.prefetch(uri)

    Image.getSize(uri, (width, height) => {
      if (width < screenWidth || height < screenHeight) {
        return getNextArtwork(this.onGetArtwork)
      }

      this.setState({ uri })
    }, this.onError)
  }

  onLoad () {
    setTimeout(() =>
      getNextArtwork(this.onGetArtwork), this.state.intervalTime)
  }

  onError (e) {
    console.log('ERROR', e)
    getNextArtwork(this.onGetArtwork)
  }

  render () {
    return <BackgroundView
      uri={this.state.uri}
      onError={this.onError}
      onLoad={this.onLoad} />
  }
}

import React, {PureComponent} from 'react'
import {Image} from 'react-native'
import BackgroundView from './renderer'
import getNextArtwork from './museums'
import {screenWidth, screenHeight} from './util/screen'

export default class App extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      uri: undefined,
      title: '',
      subTitle: '',
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
      console.warn('ERROR', err)

      return getNextArtwork(this.onGetArtwork)
    }

    const uri = data.img

    Image.getSize(uri, (width, height) => {
      if (width < screenWidth() || height < screenHeight()) {
        return getNextArtwork(this.onGetArtwork)
      }

      this.setState({
        uri: uri,
        title: data.title.trim(),
        subtitle: data.text.trim()
      })
    }, this.onError)
  }

  onLoad () {
    setTimeout(() =>
      getNextArtwork(this.onGetArtwork), this.state.intervalTime)
  }

  onError (e) {
    console.warn('ERROR', e)
    getNextArtwork(this.onGetArtwork)
  }

  render () {
    return <BackgroundView
      uri={this.state.uri}
      title={this.state.title}
      subtitle={this.state.subtitle}
      onError={this.onError}
      onLoad={this.onLoad} />
  }
}

import React, {Component} from 'react'
import {View} from 'react-native'
import ImageView from './image'
import TextView from './text'
import styles from '../util/styles'

export default class BackgroundView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      i: 0,
      uris: [undefined, undefined],
      showText: false
    }

    this.onLoad = this.onLoad.bind(this)
  }

  componentDidUpdate (oldProps) {
    if (this.props.uri === oldProps.uri) return

    const uris = this.state.uris
    uris[this.state.i ^ 1] = this.props.uri

    this.setState({ uris, showText: false })
  }

  onLoad () {
    this.setState({
      i: this.state.i ^ 1,
      showText: true
    }, this.props.onLoad)
  }

  render () {
    return <View style={styles.fullPage}>
      <ImageView
        isVisible
        uri={this.state.uris[0]}
        onLoad={this.onLoad}
        onError={this.props.onError} />
      <ImageView
        isVisible={this.state.i === 1}
        uri={this.state.uris[1]}
        onLoad={this.onLoad}
        onError={this.props.onError} />
      <TextView
        isVisible={this.state.showText}
        title={this.props.title}
        subtitle={this.props.subtitle} />
    </View>
  }
}

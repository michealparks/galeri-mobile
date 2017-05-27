import React, {Component} from 'react'
import {View} from 'react-native'
import ImageView from './image'
import styles from '../util/styles'

export default class BackgroundView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      i: 0,
      uris: [null, null]
    }

    this.onLoad = this.onLoad.bind(this)
  }

  componentDidUpdate ({ uri }) {
    if (this.props.uri === uri) return

    const uris = this.state.uris
    uris[this.state.i ^ 1] = this.props.uri

    this.setState({ uris })
  }

  onLoad () {
    this.setState({ i: this.state.i ^ 1 })
    this.props.onLoad()
  }

  render () {
    const {i, uris} = this.state

    return (
      <View style={styles.fullPage}>
        <ImageView
          isVisible
          uri={uris[0]}
          onLoad={this.onLoad}
          onError={this.props.onError} />
        <ImageView
          isVisible={i === 1}
          uri={uris[1]}
          onLoad={this.onLoad}
          onError={this.props.onError} />
      </View>
    )
  }
}

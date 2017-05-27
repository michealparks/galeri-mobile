import React, {PureComponent} from 'react'
import {Animated} from 'react-native'

export default class ImageView extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      fadeAnim: new Animated.Value(this.props.isVisible ? 1 : 0)
    }

    this.style = {
      opacity: this.state.fadeAnim,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
  }

  componentDidUpdate (newProps) {
    if (this.props.isVisible && !newProps.isVisible) {
      this.animate(1)
    } else if (!this.props.isVisible && newProps.isVisible) {
      this.animate(0)
    }
  }

  animate (toValue) {
    Animated.timing(this.state.fadeAnim, {
      toValue: toValue,
      duration: this.props.animSpeed || 2000
    }).start()
  }

  render () {
    if (!this.props.uri) {
      return null
    }

    this.style.opacity = this.state.fadeAnim

    return <Animated.Image
      resizeMode='cover'
      source={{ uri: this.props.uri }}
      onLoad={this.props.onLoad}
      onError={this.props.onError}
      style={this.style} />
  }
}

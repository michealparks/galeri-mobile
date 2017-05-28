import React, {PureComponent} from 'react'
import {Animated, View, Text, StyleSheet} from 'react-native'

export default class TextView extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      subtitle: '',
      opacity: new Animated.Value(Number(this.props.isVisible))
    }

    this.animSpeed = this.props.animSpeed || 2000
  }

  componentDidUpdate (oldProps) {
    if (oldProps.isVisible && !this.props.isVisible) {
      this.animate(0)
    } else if (!oldProps.isVisible && this.props.isVisible) {
      this.animate(1)
    }
  }

  animate (toValue) {
    Animated.timing(this.state.opacity, {
      toValue: toValue,
      duration: this.animSpeed
    }).start()
  }

  render () {
    styles.titleText.opacity = this.state.opacity
    styles.subtitleText.opacity = this.state.opacity

    return <View style={styles.view}>
      <Text style={styles.baseText}>
        <Animated.Text
          style={styles.titleText}>
          {this.state.title}{'\n'}
        </Animated.Text>
        <Animated.Text
          style={styles.subtitleText}
          numberOfLines={1}>
          {this.state.subtitle}
        </Animated.Text>
      </Text>
    </View>
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'flex-end',
    height: '100%'
  },
  baseText: {
    padding: 16,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  titleText: {
    fontSize: 16,
    opacity: 0
  },
  subtitleText: {
    fontSize: 11,
    opacity: 0
  }
})

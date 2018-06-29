// @flow
import React, { PureComponent } from 'react'
import Animated from 'animated/lib/targets/react-dom'
import Easing from 'animated/lib/Easing'

const easing = Easing.bezier(0.0, 0.3, 1, 1)

class Confetti extends PureComponent<
  {
    shape: string,
    initialXPercent: number,
    initialYPercent: number,
    initialRotation: number,
    initialScale: number,
    duration: number,
    rotations: number,
    delta: [number, number],
  },
  {
    progress: Animated.Value,
  },
> {
  state = {
    progress: new Animated.Value(0),
  }
  componentDidMount() {
    const { duration } = this.props
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration,
      easing,
    }).start()
  }
  render() {
    const {
      initialXPercent,
      initialYPercent,
      initialScale,
      initialRotation,
      shape,
      rotations,
      delta,
    } = this.props
    const { progress } = this.state
    const rotate = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${rotations * 360}deg`],
    })
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, delta[0]],
    })
    const translateY = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, delta[1]],
    })
    const opacity = progress.interpolate({
      inputRange: [0.6, 1],
      outputRange: [1, 0],
      clamp: true,
    })
    return (
      <Animated.img
        src={shape}
        style={{
          position: 'absolute',
          left: `${(100 * initialXPercent).toFixed(0)}%`,
          top: `${(100 * initialYPercent).toFixed(0)}%`,
          opacity,
          transformOrigin: 'center center',
          transform: [
            { translateX },
            { translateY },
            { scale: initialScale },
            { rotate: `${initialRotation}deg` },
            { rotate },
          ],
        }}
      />
    )
  }
}

export default Confetti

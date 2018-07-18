// @flow

import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import Animated from 'animated/lib/targets/react-dom'
import Easing from 'animated/lib/Easing'

import { colors } from 'styles/theme'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'

export { default as ModalFooter } from './ModalFooter'
export { default as ModalContent } from './ModalContent'
export { default as ModalHeader } from './ModalHeader'

const animShowHide = {
  duration: 300,
  easing: Easing.bezier(0.3, 1.0, 0.5, 0.8),
}

const domNode = process.env.STORYBOOK_ENV ? document.body : document.getElementById('modals')

type Props = {
  isOpened: boolean,
  children: React$Element<any>[],
  title: string,
  centered?: boolean,
  onBack: void => void,
  onClose: void => void,
}

type State = {
  animShowHide: Animated.Value,
  animGradient: Animated.Value,
  isInDOM: boolean,
}

class Modal extends PureComponent<Props, State> {
  state = {
    animShowHide: new Animated.Value(0),
    animGradient: new Animated.Value(0),
    isInDOM: this.props.isOpened === true,
  }

  static getDerivedStateFromProps(nextProps: Props) {
    const patch = {}
    if (nextProps.isOpened) {
      patch.isInDOM = true
    }
    return patch
  }

  componentDidMount() {
    if (this.props.isOpened) {
      this.animateEnter()

      this.state.animShowHide.addListener(({ value }) => {
        if (value === 0) this.setState({ isInDOM: false })
        if (value === 1) this.setState({ isInDOM: true })
      })
    }
  }

  componentDidUpdate(prevProps: Props) {
    const didOpened = !prevProps.isOpened && this.props.isOpened
    const didClosed = prevProps.isOpened && !this.props.isOpened

    if (didOpened) {
      this.animateEnter()
    }

    if (didClosed) {
      this.animateLeave()
    }
  }

  animateEnter = () =>
    Animated.timing(this.state.animShowHide, { ...animShowHide, toValue: 1 }).start()

  animateLeave = () =>
    Animated.timing(this.state.animShowHide, { ...animShowHide, toValue: 0 }).start()

  animateGradient = (isScrollable: boolean) => {
    const anim = {
      duration: 150,
      toValue: isScrollable ? 1 : 0,
    }
    Animated.timing(this.state.animGradient, anim).start()
  }

  render() {
    const { animShowHide, animGradient, isInDOM } = this.state
    const { title, children, centered, onBack, onClose } = this.props

    if (!isInDOM) {
      return null
    }

    const backdropStyle = {
      ...BACKDROP_STYLE,
      opacity: animShowHide,
    }

    const containerStyle = {
      ...CONTAINER_STYLE,
      justifyContent: centered ? 'center' : 'flex-start',
    }

    const scale = animShowHide.interpolate({
      inputRange: [0, 1],
      outputRange: [1.1, 1],
      clamp: true,
    })

    const bodyStyle = {
      ...BODY_STYLE,
      opacity: animShowHide,
      transform: [{ scale }],
    }

    const gradientStyle = {
      ...GRADIENT_STYLE,
      opacity: animGradient,
    }

    const content = children.length > 2 ? children.slice(0, children.length - 1) : children[0]
    const footer = children.length > 1 ? children[children.length - 1] : null

    const modal = (
      <Fragment>
        <Animated.div style={backdropStyle} />
        <div style={containerStyle}>
          <Animated.div style={bodyStyle}>
            <ModalHeader onBack={onBack} onClose={onClose}>
              {title}
            </ModalHeader>
            <ModalContent onIsScrollableChange={this.animateGradient}>{content}</ModalContent>
            <div style={GRADIENT_WRAPPER_STYLE}>
              <Animated.div style={gradientStyle} />
            </div>
            {footer}
          </Animated.div>
        </div>
      </Fragment>
    )

    return domNode ? createPortal(modal, domNode) : null
  }
}

const BACKDROP_STYLE = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.4)',
}

const CONTAINER_STYLE = {
  ...BACKDROP_STYLE,
  background: 'transparent',
  padding: '60px 0 60px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const BODY_STYLE = {
  background: 'white',
  width: 500,
  borderRadius: 3,
  boxShadow: 'box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2)',
  color: colors.smoke,
  flexShrink: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const GRADIENT_STYLE = {
  background: 'linear-gradient(rgba(255, 255, 255, 0), #ffffff)',
  height: 40,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 6,
}

const GRADIENT_WRAPPER_STYLE = {
  height: 0,
  position: 'relative',
  pointerEvents: 'none',
}

export default Modal

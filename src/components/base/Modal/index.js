// @flow

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { connect } from 'react-redux'
import noop from 'lodash/noop'
import Animated from 'animated/lib/targets/react-dom'
import Easing from 'animated/lib/Easing'

import { closeModal, isModalOpened, getModalData } from 'reducers/modals'
import { colors } from 'styles/theme'

export { default as ModalBody } from './ModalBody'

const animShowHide = {
  duration: 200,
  easing: Easing.bezier(0.3, 1.0, 0.5, 0.8),
}

const domNode = process.env.STORYBOOK_ENV ? document.body : document.getElementById('modals')

const mapStateToProps = (state, { name, isOpened, onBeforeOpen }: Props): * => {
  const data = getModalData(state, name || '')
  const modalOpened = isOpened || (name && isModalOpened(state, name))

  if (onBeforeOpen && modalOpened) {
    onBeforeOpen({ data })
  }

  return {
    isOpened: !!modalOpened,
    data,
  }
}

const mapDispatchToProps = (dispatch: *, { name, onClose = noop }: Props): * => ({
  onClose: name
    ? () => {
        dispatch(closeModal(name))
        onClose()
      }
    : onClose,
})

export type RenderProps = {
  onClose?: void => void,
  data: any,
}

type Props = {
  isOpened?: boolean,
  children?: any,
  centered?: boolean,
  onClose?: void => void,
  onHide?: void => void,
  render?: RenderProps => any,
  data?: any,
  preventBackdropClick?: boolean,

  name?: string, // eslint-disable-line
  onBeforeOpen?: ({ data: * }) => *, // eslint-disable-line
}

type State = {
  animShowHide: Animated.Value,
  isInDOM: boolean,
}

class Modal extends PureComponent<Props, State> {
  state = {
    animShowHide: new Animated.Value(0),
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
    }

    this.state.animShowHide.addListener(({ value }) => {
      if (value === 0) {
        const { onHide } = this.props
        this.setState({ isInDOM: false })
        if (onHide) {
          onHide()
        }
      }
      if (value === 1) this.setState({ isInDOM: true })
    })

    document.addEventListener('keyup', this.handleKeyup)
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

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyup)
  }

  handleKeyup = (e: KeyboardEvent) => {
    const { onClose, preventBackdropClick } = this.props
    if (e.which === 27 && onClose && !preventBackdropClick) {
      onClose()
    }
  }

  handleClickOnBackdrop = () => {
    const { preventBackdropClick, onClose } = this.props
    if (!preventBackdropClick && onClose) {
      onClose()
    }
  }

  swallowClick = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  animateEnter = () =>
    Animated.timing(this.state.animShowHide, { ...animShowHide, toValue: 1 }).start()

  animateLeave = () =>
    Animated.timing(this.state.animShowHide, { ...animShowHide, toValue: 0 }).start()

  render() {
    const { animShowHide, isInDOM } = this.state
    const { children, render, centered, onClose, data, isOpened } = this.props

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
      pointerEvents: isOpened ? 'auto' : 'none',
    }

    const scale = animShowHide.interpolate({
      inputRange: [0, 1],
      outputRange: [1.1, 1],
      clamp: true,
    })

    const bodyWrapperStyle = {
      ...BODY_WRAPPER_STYLE,
      opacity: animShowHide,
      transform: [{ scale }],
    }

    const renderProps = {
      onClose,
      data,
    }

    const modal = (
      <Fragment>
        <Animated.div style={backdropStyle} />
        <div style={containerStyle} onClick={this.handleClickOnBackdrop}>
          <Animated.div style={bodyWrapperStyle} onClick={this.swallowClick}>
            {render && render(renderProps)}
            {children}
          </Animated.div>
        </div>
      </Fragment>
    )

    return domNode ? createPortal(modal, domNode) : null
  }
}

const BACKDROP_STYLE = {
  pointerEvents: 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  zIndex: 100,
}

const CONTAINER_STYLE = {
  ...BACKDROP_STYLE,
  background: 'transparent',
  padding: '60px 0 60px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const BODY_WRAPPER_STYLE = {
  background: 'white',
  width: 500,
  borderRadius: 3,
  boxShadow: 'box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2)',
  color: colors.smoke,
  flexShrink: 1,
  display: 'flex',
  flexDirection: 'column',
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Modal)

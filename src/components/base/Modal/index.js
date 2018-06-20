// @flow

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import Mortal from 'react-mortal'
import styled from 'styled-components'
import noop from 'lodash/noop'
import { EXPERIMENTAL_CENTER_MODAL } from 'config/constants'

import { rgba } from 'styles/helpers'
import { radii } from 'styles/theme'

import { closeModal, isModalOpened, getModalData } from 'reducers/modals'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Defer from 'components/base/Defer'

export { default as ModalBody } from './ModalBody'
export { default as ConfirmModal } from './ConfirmModal'
export { default as ModalTitle } from './ModalTitle'

const springConfig = {
  stiffness: 320,
}

type OwnProps = {
  name?: string, // eslint-disable-line
  isOpened?: boolean,
  onBeforeOpen?: ({ data: * }) => *, // eslint-disable-line
  onClose?: () => void,
  onHide?: () => void,
  preventBackdropClick?: boolean,
  render: Function,
  refocusWhenChange?: string,
  width?: string,
}

type Props = OwnProps & {
  isOpened?: boolean,
  data?: any,
} & {
  onClose?: () => void,
}

const mapStateToProps = (state, { name, isOpened, onBeforeOpen }: OwnProps): * => {
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

const mapDispatchToProps = (dispatch: *, { name, onClose = noop }: OwnProps): * => ({
  onClose: name
    ? () => {
        dispatch(closeModal(name))
        onClose()
      }
    : onClose,
})

const Container = styled(Box).attrs({
  color: 'grey',
  sticky: true,
  style: p => ({
    pointerEvents: p.isVisible ? 'auto' : 'none',
  }),
})`
  position: fixed;
  z-index: 30;
`

const Backdrop = styled(Box).attrs({
  bg: p => rgba(p.theme.colors.black, 0.4),
  sticky: true,
  style: p => ({
    opacity: p.op,
  }),
})`
  position: fixed;
`

const NonClickableHeadArea = styled.div`
  position: fixed;
  height: 48px;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
`

const Wrapper = styled(Box).attrs({
  bg: 'transparent',
  flow: 4,
  style: p => ({
    opacity: p.op,
    transform: `scale3d(${p.scale}, ${p.scale}, ${p.scale})`,
  }),
})`
  outline: none;
  width: ${p => (p.width ? p.width : '500px')};
  z-index: 2;
`

class Pure extends Component<any> {
  shouldComponentUpdate(nextProps) {
    if (nextProps.isAnimated) {
      return false
    }

    return true
  }

  render() {
    const { data, onClose, render } = this.props

    return <Defer>{render({ data, onClose })}</Defer>
  }
}

function stopPropagation(e) {
  e.stopPropagation()
}

const wrap = EXPERIMENTAL_CENTER_MODAL
  ? children => (
      <Box alignItems="center" justifyContent="center" grow>
        {children}
      </Box>
    )
  : children => (
      <GrowScroll alignItems="center" full pt={8}>
        {children}
      </GrowScroll>
    )

export class Modal extends Component<Props> {
  static defaultProps = {
    isOpened: false,
    onHide: noop,
    preventBackdropClick: false,
  }

  shouldComponentUpdate(nextProps: Props) {
    if (this.props.isOpened || nextProps.isOpened) {
      return true
    }

    return false
  }

  componentDidUpdate(prevProps: Props) {
    const didOpened = this.props.isOpened && !prevProps.isOpened
    const didClose = !this.props.isOpened && prevProps.isOpened
    const shouldFocus = didOpened || this.props.refocusWhenChange !== prevProps.refocusWhenChange
    if (didOpened) {
      // Store a reference to the last active element, to restore it after
      // modal close
      this._lastFocusedElement = document.activeElement
    }
    if (shouldFocus) {
      this.focusWrapper()
    }

    if (didClose) {
      if (this._lastFocusedElement) {
        this._lastFocusedElement.focus()
      }
    }
  }

  _wrapper = null
  _lastFocusedElement = null

  focusWrapper = () => {
    // Forced to use findDOMNode here, because innerRef is giving a proxied component
    const domWrapper = findDOMNode(this._wrapper) // eslint-disable-line react/no-find-dom-node

    if (domWrapper instanceof HTMLDivElement) {
      domWrapper.focus()
    }
  }

  render() {
    const { preventBackdropClick, isOpened, onHide, render, data, onClose, width } = this.props

    return (
      <Mortal
        isOpened={isOpened}
        onClose={onClose}
        onHide={onHide}
        closeOnEsc={!preventBackdropClick}
        motionStyle={(spring, isVisible) => ({
          opacity: spring(isVisible ? 1 : 0, springConfig),
          scale: spring(isVisible ? 1 : 0.95, springConfig),
        })}
      >
        {(m, isVisible, isAnimated) => (
          <Container isVisible={isVisible} onClick={preventBackdropClick ? undefined : onClose}>
            <Backdrop op={m.opacity} />
            <NonClickableHeadArea onClick={stopPropagation} />
            {wrap(
              <Wrapper
                tabIndex={-1}
                op={m.opacity}
                scale={m.scale}
                innerRef={n => (this._wrapper = n)}
                onClick={stopPropagation}
                width={width}
              >
                <Pure isAnimated={isAnimated} render={render} data={data} onClose={onClose} />
              </Wrapper>,
            )}
          </Container>
        )}
      </Mortal>
    )
  }
}

export const ModalFooter = styled(Box).attrs({
  px: 5,
  py: 3,
})`
  border-top: 2px solid ${p => p.theme.colors.lightGrey};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
`

export const ModalContent = styled(Box).attrs({
  px: 5,
  pb: 5,
})``

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Modal)

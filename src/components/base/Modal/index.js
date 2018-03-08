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

import { rgba } from 'styles/helpers'

import { closeModal, isModalOpened, getModalData } from 'reducers/modals'

import Box, { Tabbable } from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Defer from 'components/base/Defer'

import IconCross from 'icons/Cross'

const springConfig = {
  stiffness: 380,
}

const mapStateToProps: Function = (
  state,
  { name, isOpened }: { name: string, isOpened?: boolean },
): Object => ({
  isOpened: isOpened || (name && isModalOpened(state, name)),
  data: getModalData(state, name),
})

const mapDispatchToProps: Function = (dispatch, { name, onClose = noop }): Object => ({
  onClose: name
    ? () => {
        dispatch(closeModal(name))
        onClose()
      }
    : onClose,
})

const Container = styled(Box).attrs({
  color: 'grey',
  alignItems: 'center',
  justifyContent: 'flex-start',
  sticky: true,
  style: p => ({
    pointerEvents: p.isVisible ? 'auto' : 'none',
  }),
})`
  position: fixed;
  z-index: 20;
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

const Wrapper = styled(Tabbable).attrs({
  bg: 'transparent',
  flow: 4,
  mt: 100,
  mb: 100,
  style: p => ({
    opacity: p.op,
    transform: `scale3d(${p.scale}, ${p.scale}, ${p.scale})`,
  }),
})`
  outline: none;
  width: 570px;
  z-index: 2;
`

const Body = styled(Box).attrs({
  bg: p => p.theme.colors.white,
  relative: true,
})`
  border-radius: 5px;
`

const CloseContainer = styled(Box).attrs({
  p: 4,
  color: 'fog',
})`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    color: ${p => p.theme.colors.grey};
  }
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

type Props = {
  isOpened?: boolean,
  onClose: Function,
  onHide?: Function,
  preventBackdropClick?: boolean,
  render: Function,
  data?: any,
}

export class Modal extends Component<Props> {
  static defaultProps = {
    data: undefined,
    isOpened: false,
    onClose: noop,
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
    if (didOpened) {
      // Store a reference to the last active element, to restore it after
      // modal close
      this._lastFocusedElement = document.activeElement

      // Forced to use findDOMNode here, because innerRef is giving a proxied component
      const domWrapper = findDOMNode(this._wrapper) // eslint-disable-line react/no-find-dom-node

      if (domWrapper instanceof HTMLDivElement) {
        domWrapper.focus()
      }
    }
    if (didClose) {
      if (this._lastFocusedElement) {
        this._lastFocusedElement.focus()
      }
    }
  }

  _wrapper = null
  _lastFocusedElement = null

  render() {
    const { preventBackdropClick, isOpened, onClose, onHide, render, data } = this.props

    return (
      <Mortal
        isOpened={isOpened}
        onClose={onClose}
        onHide={onHide}
        motionStyle={(spring, isVisible) => ({
          opacity: spring(isVisible ? 1 : 0, springConfig),
          scale: spring(isVisible ? 1 : 0.95, springConfig),
        })}
      >
        {(m, isVisible, isAnimated) => (
          <Container isVisible={isVisible} onClick={preventBackdropClick ? undefined : onClose}>
            <Backdrop op={m.opacity} />
            <GrowScroll
              alignItems="center"
              full
              justifyContent="flex-start"
              style={{ height: '100%' }}
            >
              <Wrapper
                op={m.opacity}
                scale={m.scale}
                innerRef={n => (this._wrapper = n)}
                onClick={e => e.stopPropagation()}
              >
                <Pure isAnimated={isAnimated} render={render} data={data} onClose={onClose} />
              </Wrapper>
            </GrowScroll>
          </Container>
        )}
      </Mortal>
    )
  }
}

export const ModalBody = ({
  children,
  onClose,
  ...props
}: {
  children: any,
  onClose?: Function,
}) => (
  <Body>
    {onClose && (
      <CloseContainer onClick={onClose}>
        <IconCross height={16} width={16} />
      </CloseContainer>
    )}
    <Box p={5} {...props}>
      {children}
    </Box>
  </Body>
)

ModalBody.defaultProps = {
  onClose: undefined,
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)

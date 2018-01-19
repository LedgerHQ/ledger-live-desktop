// @flow

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Mortal from 'react-mortal'
import styled from 'styled-components'
import noop from 'lodash/noop'

import type { Element } from 'react'

import { rgba } from 'styles/helpers'

import { closeModal, isModalOpened } from 'reducers/modals'

import Box from 'components/base/Box'

type Props = {
  isOpened?: boolean,
  onClose: Function,
  preventBackdropClick: boolean,
  render: Function,
}

const springConfig = {
  stiffness: 350,
}

const mapStateToProps = (state, { name, isOpened }) => ({
  isOpened: isOpened || (name && isModalOpened(state, name)),
})

const mapDispatchToProps = (dispatch, { name, onClose = noop }) => ({
  onClose: name
    ? () => {
        dispatch(closeModal(name))
        onClose()
      }
    : onClose,
})

const Container = styled(Box).attrs({
  align: 'center',
  justify: 'flex-start',
  sticky: true,
  style: p => ({
    pointerEvents: p.isVisible ? 'auto' : 'none',
  }),
})`
  overflow: hidden;
  position: fixed;
  z-index: 1;
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

const Wrapper = styled(Box).attrs({
  bg: 'transparent',
  flow: 20,
  mt: 100,
  style: p => ({
    opacity: p.op,
    transform: `translate3d(0, ${p.offset}px, 0)`,
  }),
})`
  width: 430px;
  z-index: 2;
`

const Body = styled(Box).attrs({
  bg: p => p.theme.colors.white,
  p: 20,
})`
  border-radius: 5px;
`

export class Modal extends PureComponent<Props> {
  static defaultProps = {
    onClose: noop,
    preventBackdropClick: true,
    isOpened: false,
  }

  render() {
    const { preventBackdropClick, isOpened, onClose, render } = this.props
    return (
      <Mortal
        isOpened={isOpened}
        onClose={onClose}
        motionStyle={(spring, isVisible) => ({
          opacity: spring(isVisible ? 1 : 0, springConfig),
          y: spring(isVisible ? 0 : 20, springConfig),
        })}
      >
        {(m, isVisible) => (
          <Container isVisible={isVisible}>
            <Backdrop op={m.opacity} onClick={preventBackdropClick ? undefined : onClose} />
            <Wrapper op={m.opacity} offset={m.y}>
              {render({ onClose })}
            </Wrapper>
          </Container>
        )}
      </Mortal>
    )
  }
}

export const ModalBody = ({
  children,
  onClose,
}: {
  children: Element<any> | string,
  onClose?: Function,
}) => (
  <Body>
    {onClose && (
      <Box align="flex-end">
        <Box onClick={onClose}>[x]</Box>
      </Box>
    )}
    {children}
  </Body>
)

ModalBody.defaultProps = {
  onClose: undefined,
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)

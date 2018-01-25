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
import Icon from 'components/base/Icon'

type Props = {
  isOpened?: boolean,
  onClose: Function,
  preventBackdropClick?: boolean,
  preventSideMargin?: boolean,
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
  color: 'grey',
  align: 'center',
  justify: 'flex-start',
  sticky: true,
  style: p => ({
    pointerEvents: p.isVisible ? 'auto' : 'none',
  }),
})`
  overflow: hidden;
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

const Wrapper = styled(Box).attrs({
  bg: 'transparent',
  flow: 20,
  mt: 100,
  style: p => ({
    opacity: p.op,
    transform: `translate3d(0, ${p.offset}px, 0)`,
  }),
})`
  margin-left: ${p => (p.preventSideMargin ? 0 : p.theme.sizes.sideBarWidth)}px;
  width: 570px;
  z-index: 2;
`

const Body = styled(Box).attrs({
  bg: p => p.theme.colors.white,
  p: 3,
})`
  border-radius: 5px;
`

const CloseContainer = styled(Box).attrs({
  p: 2,
  color: 'mouse',
})`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    color: ${p => p.theme.colors.grey};
  }
`

export class Modal extends PureComponent<Props> {
  static defaultProps = {
    onClose: noop,
    preventBackdropClick: false,
    preventSideMargin: false,
    isOpened: false,
  }

  render() {
    const { preventBackdropClick, preventSideMargin, isOpened, onClose, render } = this.props
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
            <Wrapper preventSideMargin={preventSideMargin} op={m.opacity} offset={m.y}>
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
  ...props
}: {
  children: Element<any> | string,
  onClose?: Function,
}) => (
  <Body>
    {onClose && (
      <CloseContainer onClick={onClose}>
        <Icon fontSize={3} name="times" />
      </CloseContainer>
    )}
    <Box {...props}>{children}</Box>
  </Body>
)

ModalBody.defaultProps = {
  onClose: undefined,
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)

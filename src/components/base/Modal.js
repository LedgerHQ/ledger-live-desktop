// @flow
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Mortal from 'react-mortal'
import styled from 'styled-components'

import { closeModal, isModalOpened } from 'reducers/modals'

type Props = {
  isOpened?: boolean,
  onClose: Function,
  children: any,
}

const springConfig = {
  stiffness: 350,
}

const mapStateToProps = (state, { name, isOpened }) => ({
  isOpened: isOpened || (name && isModalOpened(state, name)),
})

const mapDispatchToProps = (dispatch, { name }) => ({
  onClose: name ? () => dispatch(closeModal(name)) : undefined,
})

const Container = styled.div.attrs({
  style: p => ({
    pointerEvents: p.isVisible ? 'auto' : 'none',
  }),
})`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

const Backdrop = styled.div.attrs({
  style: p => ({
    opacity: p.op,
  }),
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
`

const Body = styled.div.attrs({
  style: p => ({
    opacity: p.op,
    transform: `translate3d(0, ${p.offset}px, 0)`,
  }),
})`
  padding: 20px;
  margin-top: 100px;
  background: white;
  width: 400px;
  z-index: 2;
`

class Modal extends PureComponent<Props> {
  static defaultProps = {
    isOpened: false,
  }

  render() {
    const { isOpened, onClose, children } = this.props
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
            <Backdrop op={m.opacity} onClick={onClose} />
            <Body op={m.opacity} offset={m.y}>
              {children}
            </Body>
          </Container>
        )}
      </Mortal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)

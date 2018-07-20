// @flow

import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'

import Box from 'components/base/Box'
import IconCross from 'icons/Cross'

export const Container = styled(Box).attrs({
  px: 5,
  pb: 5,
})``

type Props = {
  deferHeight?: number,
  onClose?: Function,
  children: any,
}

type State = {
  isHidden: boolean,
}

class ModalBody extends PureComponent<Props, State> {
  static defaultProps = {
    onClose: undefined,
  }

  state = {
    isHidden: true,
  }

  componentDidMount() {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.setState({ isHidden: false })
      })
    }, 150)
  }

  render() {
    const { children, onClose, deferHeight, ...props } = this.props
    const { isHidden } = this.state
    return (
      <Body style={{ height: isHidden && deferHeight ? deferHeight : undefined }}>
        {onClose && (
          <CloseContainer onClick={onClose}>
            <IconCross size={16} />
          </CloseContainer>
        )}
        {(!isHidden || !deferHeight) && <Inner {...props}>{children}</Inner>}
      </Body>
    )
  }
}

const CloseContainer = styled(Box).attrs({
  p: 4,
  color: 'fog',
})`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;

  &:hover {
    color: ${p => p.theme.colors.grey};
  }

  &:active {
    color: ${p => p.theme.colors.dark};
  }
`

const Body = styled(Box).attrs({
  bg: p => p.theme.colors.white,
  relative: true,
  borderRadius: 1,
  selectable: true,
})`
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2);
`

const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const Inner = styled(Box)`
  animation: ${appear} 80ms linear;
`

export default ModalBody

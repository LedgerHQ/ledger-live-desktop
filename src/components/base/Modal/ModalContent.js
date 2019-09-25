// @flow

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React, { PureComponent } from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  position: relative;
  flex: 0;
  display: flex;
  flex-direction: column;
`

const ContentScrollableContainer = styled.div`
  padding: 20px 20px 40px;
  overflow: ${p => (p.noScroll ? 'visible' : 'auto')};
  position: relative;
  flex: 0;
`

const ContentScrollableContainerGradient = styled.div.attrs(p => ({
  style: {
    opacity: p.opacity,
  },
}))`
  background: linear-gradient(
    rgba(255, 255, 255, 0),
    ${p => p.theme.colors.palette.background.paper}
  );
  transition: opacity 150ms;
  height: 40px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
`

type Props = {
  children: any,
  noScroll?: boolean,
}

type State = {
  isScrollable: boolean,
}

class ModalContent extends PureComponent<Props, State> {
  constructor() {
    super()

    this.state = {
      isScrollable: false,
    }
  }

  componentDidMount() {
    window.requestAnimationFrame(() => {
      if (this._isUnmounted) return
      this.showHideGradient()
      if (this._outer) {
        const ro = new ResizeObserver(this.showHideGradient)
        ro.observe(this._outer)
      }
    })
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  _outer = null
  _isUnmounted = false

  showHideGradient = () => {
    if (!this._outer) return
    const isScrollable = this._outer.scrollHeight > this._outer.clientHeight
    this.setState({ isScrollable })
  }

  render() {
    const { children, noScroll } = this.props
    const { isScrollable } = this.state

    return (
      <ContentWrapper>
        <ContentScrollableContainer ref={n => (this._outer = n)} tabIndex={0} noScroll={noScroll}>
          {children}
        </ContentScrollableContainer>
        <ContentScrollableContainerGradient opacity={isScrollable ? 1 : 0} />
      </ContentWrapper>
    )
  }
}

export default ModalContent

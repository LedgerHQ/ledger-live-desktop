// @flow
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import smoothscroll from 'smoothscroll-polyfill'
import { track } from 'analytics/segment'
import Box from 'components/base/Box'
import AngleUp from 'icons/AngleUp'
import { GrowScrollContext } from './base/GrowScroll'

smoothscroll.polyfill()

const Container = styled(Box)`
  position: fixed;
  z-index: 10;
  bottom: 100px;
  right: 20px;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(102, 102, 102, 0.25);
  cursor: pointer;
  height: 36px;
  width: 36px;
  color: ${p => p.theme.colors.palette.primary.contrastText};
  background-color: ${p => p.theme.colors.palette.primary.main};
  transition: all 0.5s;
  opacity: ${p => (p.visible ? 1 : 0)};
  pointer-events: ${p => (!p.visible ? 'none' : 'initial')};

  &:focus {
    width: 200px;
  }
`

type Props = {
  scrollUpOnMount?: boolean,
  scrollThreshold: number,
  getGrowScroll: () => { scrollContainer: ?HTMLDivElement },
}

type State = {
  visible: boolean,
}

class StickyBackToTop extends PureComponent<Props, State> {
  static defaultProps = {
    scrollThreshold: 800,
  }

  state = {
    visible: false,
  }

  componentDidMount() {
    const { scrollContainer } = this.props.getGrowScroll()
    if (scrollContainer) {
      const listener = () => {
        if (this._unmounted) return
        const { scrollTop } = scrollContainer
        const visible = scrollTop > this.props.scrollThreshold
        this.setState(previous => {
          if (previous.visible !== visible) {
            return { visible }
          }
          return null
        })
      }
      scrollContainer.addEventListener('scroll', listener)
      this.releaseListener = () => scrollContainer.removeEventListener('scroll', listener)
      if (this.props.scrollUpOnMount) {
        // $FlowFixMe
        scrollContainer.scrollTo({ top: 0 })
      }
    }
  }

  componentWillUnmount() {
    this._unmounted = true
    this.releaseListener()
  }

  _unmounted = false

  onClick = () => {
    const { scrollContainer } = this.props.getGrowScroll()
    if (scrollContainer) {
      // $FlowFixMe seems to be missing in flow
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
      track('ScrollBackToTop')
    }
  }

  releaseListener = () => {}

  render() {
    const { visible } = this.state
    const el = document.getElementById('sticky-back-to-top-root')
    if (!el) return null
    return ReactDOM.createPortal(
      <Container align="center" justify="center" visible={visible} onClick={this.onClick}>
        <AngleUp size={20} />
      </Container>,
      el,
    )
  }
}

export default (props: { scrollThreshold?: number }) => (
  <GrowScrollContext.Consumer>
    {getGrowScroll => <StickyBackToTop {...props} getGrowScroll={getGrowScroll} />}
  </GrowScrollContext.Consumer>
)

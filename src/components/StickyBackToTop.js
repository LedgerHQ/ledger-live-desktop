// @flow
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Box from 'components/base/Box'
import ArrowUp from 'icons/ArrowUp'

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
  color: white;
  background-color: #6490f1;
  transition: all 0.5s;
  opacity: ${p => (p.visible ? 1 : 0)};
  pointer-events: ${p => (!p.visible ? 'none' : 'initial')};

  &:focus {
    width: 200px;
  }
`

type Props = {
  scrollThreshold: number,
}

type State = {
  visible: boolean,
}

class StickyBackToTop extends PureComponent<Props, State> {
  static contextTypes = {
    // FIXME when we move to "real" scroll container, potential solution (instead of context): http://greweb.me/2016/09/relay-scrolling-connections/
    getScrollbar: PropTypes.func,
  }

  static defaultProps = {
    scrollThreshold: 800,
  }

  state = {
    visible: false,
  }

  componentDidMount() {
    if (!this.context.getScrollbar) return
    this.context.getScrollbar(scrollbar => {
      const listener = () => {
        const { scrollTop } = scrollbar
        const visible = scrollTop > this.props.scrollThreshold
        this.setState(previous => {
          if (previous.visible !== visible) {
            return { visible }
          }
          return null
        })
      }
      scrollbar.addListener(listener)
      this.releaseListener = () => scrollbar.removeListener(listener)
    })
  }

  componentWillUnmount() {
    this.releaseListener()
  }

  onClick = () => {
    this.context.getScrollbar(scrollbar => {
      scrollbar.scrollTo(0, 0, 400)
    })
  }

  releaseListener = () => {}

  render() {
    const { visible } = this.state
    const el = document.getElementById('sticky-back-to-top-root')
    if (!el) return null
    return ReactDOM.createPortal(
      <Container align="center" justify="center" visible={visible} onClick={this.onClick}>
        <ArrowUp size={16} />
      </Container>,
      el,
    )
  }
}

export default StickyBackToTop

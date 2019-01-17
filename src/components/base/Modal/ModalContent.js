// @flow

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React, { PureComponent } from 'react'

class ModalContent extends PureComponent<{
  children: any,
  onIsScrollableChange: boolean => void,
  noScroll?: boolean,
}> {
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
    const { onIsScrollableChange } = this.props
    const isScrollable = this._outer.scrollHeight > this._outer.clientHeight
    onIsScrollableChange(isScrollable)
  }

  render() {
    const { children, noScroll } = this.props

    const contentStyle = {
      ...CONTENT_STYLE,
      overflow: noScroll ? 'visible' : 'auto',
    }

    return (
      <div style={contentStyle} ref={n => (this._outer = n)} tabIndex={0}>
        {children}
      </div>
    )
  }
}

const CONTENT_STYLE = {
  flexShrink: 1,
  padding: 20,
  paddingBottom: 40,
}

export default ModalContent

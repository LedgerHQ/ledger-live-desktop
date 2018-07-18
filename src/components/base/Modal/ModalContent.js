// @flow

import React, { PureComponent } from 'react'

class ModalContent extends PureComponent<{
  children: any,
  onIsScrollableChange: boolean => void,
}> {
  componentDidMount() {
    this.showHideGradient()
    if (this._outer) {
      const ro = new ResizeObserver(this.showHideGradient)
      ro.observe(this._outer)
    }
  }

  _outer = null

  showHideGradient = () => {
    if (!this._outer) return
    const { onIsScrollableChange } = this.props
    const isScrollable = this._outer.scrollHeight > this._outer.clientHeight
    onIsScrollableChange(isScrollable)
  }

  render() {
    const { children } = this.props

    return (
      <div style={CONTENT_STYLE} ref={n => (this._outer = n)}>
        {children}
      </div>
    )
  }
}

const CONTENT_STYLE = {
  flexShrink: 1,
  overflow: 'auto',
  padding: 20,
  paddingBottom: 40,
}

export default ModalContent

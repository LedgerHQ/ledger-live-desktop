// @flow

/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react'
import Scrollbar from 'react-smooth-scrollbar'
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar'
import noop from 'lodash/noop'

import Box from 'components/base/Box'

type Props = {
  children: any,
  full: boolean,
  maxHeight?: number,
  onUpdate: Function,
  onScroll: Function,
}

class GrowScroll extends PureComponent<Props> {
  static defaultProps = {
    full: false,
    onUpdate: noop,
    onScroll: noop,
  }

  componentDidMount() {
    this.handleUpdate(this.props)

    if (this._scrollbar) {
      this._scrollbar.addListener(this.props.onScroll)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.handleUpdate(nextProps)
  }

  componentWillUnmount() {
    if (this._scrollbar) {
      this._scrollbar.removeListener(this.props.onScroll)
    }
  }

  handleUpdate = (props: Props) => {
    if (this._scrollbar) {
      props.onUpdate(this._scrollbar)
    }
  }

  _scrollbar = undefined

  render() {
    const { onUpdate, children, maxHeight, full, ...props } = this.props

    return (
      <Box
        {...(full
          ? {
              sticky: true,
            }
          : {
              grow: true,
              relative: true,
            })}
      >
        <Scrollbar
          damping={1}
          style={{
            ...(maxHeight
              ? {
                  maxHeight,
                }
              : {
                  bottom: 0,
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }),
          }}
          ref={r => r && (this._scrollbar = r.scrollbar)}
        >
          <Box {...props}>{children}</Box>
        </Scrollbar>
      </Box>
    )
  }
}

SmoothScrollbar.use(
  class DisableXScroll extends ScrollbarPlugin {
    static pluginName = 'disableXScroll'

    transformDelta(delta) {
      return {
        x: 0,
        y: delta.y,
      }
    }
  },
)

export default GrowScroll

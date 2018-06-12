// @flow

/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react'
import Scrollbar from 'react-smooth-scrollbar'
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar'

import Box from 'components/base/Box'

type Props = {
  children: any,
  full: boolean,
  maxHeight?: number,
  onUpdate?: (*) => void,
  onScroll?: () => void,
}

// TODO this component is the source of junky scroll experience. need better solution ASAP
class GrowScroll extends PureComponent<Props> {
  static defaultProps = {
    full: false,
  }

  componentDidMount() {
    const { onUpdate, onScroll } = this.props
    const { _scrollbar } = this
    if (_scrollbar) {
      if (onUpdate) {
        onUpdate(_scrollbar)
      }
      if (onScroll) {
        _scrollbar.addListener(this.onScroll)
      }
    }
  }

  componentWillUnmount() {
    const { onScroll } = this.props
    const { _scrollbar } = this
    if (_scrollbar && onScroll) {
      _scrollbar.removeListener(this.onScroll)
    }
  }

  componenDidUpdate() {
    const { onUpdate } = this.props
    const { _scrollbar } = this
    if (_scrollbar && onUpdate) {
      onUpdate(_scrollbar)
    }
  }

  onScroll = () => {
    const { onScroll } = this.props
    if (onScroll) onScroll()
  }

  onRef = (ref: ?Scrollbar) => {
    this._scrollbar = ref && ref.scrollbar
  }

  _scrollbar: *

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
          ref={this.onRef}
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

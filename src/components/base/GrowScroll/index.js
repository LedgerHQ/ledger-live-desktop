// @flow

import React, { PureComponent } from 'react'
import Scrollbar from 'react-smooth-scrollbar'
import noop from 'lodash/noop'

import Box from 'components/base/Box'

type Props = {
  maxHeight?: number | string,
  children: any,
  offsetLimit: Object,
  onUpdate: Function,
}

class GrowScroll extends PureComponent<Props> {
  static defaultProps = {
    onUpdate: noop,
    offsetLimit: {
      y: {
        max: -3,
        min: 3,
      },
    },
  }

  componentDidMount() {
    const { offsetLimit } = this.props

    if (this._scrollbar) {
      this._scrollbar.addListener(function onScroll({ limit, offset }) {
        if (limit.y > 0) {
          const maxY = limit.y + offsetLimit.y.max
          const minY = offsetLimit.y.min

          if (offset.y > maxY) {
            this.setPosition(offset.x, maxY, {
              withoutCallbacks: true,
            })
          }

          if (offset.y < minY) {
            this.setPosition(offset.x, minY, {
              withoutCallbacks: true,
            })
          }
        }
      })
    }

    this.handleUpdate(this.props)
  }

  componentWillReceiveProps(nextProps: Props) {
    this.handleUpdate(nextProps)
  }

  handleUpdate = (props: Props) => {
    if (this._scrollbar) {
      props.onUpdate(this._scrollbar)
    }
  }

  _scrollbar = undefined

  render() {
    const { onUpdate, children, maxHeight, ...props } = this.props

    return (
      <Box grow relative>
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

export default GrowScroll

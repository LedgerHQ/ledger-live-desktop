// @flow

import React, { PureComponent } from 'react'
import Scrollbar from 'react-smooth-scrollbar'
import noop from 'lodash/noop'

import Box from 'components/base/Box'

type Props = {
  children: any,
  full: boolean,
  maxHeight?: number,
  onUpdate: Function,
}

class GrowScroll extends PureComponent<Props> {
  static defaultProps = {
    full: false,
    onUpdate: noop,
  }

  componentDidMount() {
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

export default GrowScroll

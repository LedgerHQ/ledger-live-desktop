// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'

type Props = {
  children: any,
  full: boolean,
  maxHeight?: number,
}

export const GrowScrollContext = React.createContext()

class GrowScroll extends PureComponent<Props> {
  static defaultProps = {
    full: false,
  }

  scrollContainer: ?HTMLDivElement

  onScrollContainerRef = (scrollContainer: ?HTMLDivElement) => {
    this.scrollContainer = scrollContainer
  }

  valueProvider = () => ({
    scrollContainer: this.scrollContainer,
  })

  render() {
    const { children, maxHeight, full, ...props } = this.props

    const rootStyles = {
      overflow: 'hidden',
      ...(full
        ? {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }
        : {
            display: 'flex',
            flex: 1,
            position: 'relative',
          }),
    }

    const scrollContainerStyles = {
      overflowY: 'auto',
      marginRight: `-80px`,
      paddingRight: `80px`,
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
    }

    return (
      <div style={rootStyles}>
        <div style={scrollContainerStyles} ref={this.onScrollContainerRef}>
          <Box {...props}>
            <GrowScrollContext.Provider value={this.valueProvider}>
              {children}
            </GrowScrollContext.Provider>
          </Box>
        </div>
      </div>
    )
  }
}

export default GrowScroll

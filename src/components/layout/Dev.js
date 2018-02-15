// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'

import DevTools from 'components/DevTools'

const Container = styled(Box).attrs({
  grow: true,
})`
  height: 100%;
`

class Dev extends PureComponent<{}> {
  render() {
    return (
      <Container>
        <GrowScroll>
          <DevTools />
        </GrowScroll>
      </Container>
    )
  }
}

export default Dev

// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import Box, { GrowScroll } from 'components/base/Box'
import Item from './Item'

const CapsSubtitle = styled(Box).attrs({
  px: 2,
  fontSize: 0,
  color: 'shark',
})`
  text-transform: uppercase;
  font-weight: bold;
`

const Container = styled(GrowScroll).attrs({
  flow: 4,
  py: 4,
})`
  background-color: ${p => rgba(p.theme.color, 0.4)};
`

class SideBar extends PureComponent<{}> {
  render() {
    return (
      <Box noShrink style={{ width: 250 }}>
        <Container>
          <Box flow={2}>
            <CapsSubtitle>{'Menu'}</CapsSubtitle>
            <div>
              <Item linkTo="/">{'Dashboard'}</Item>
              <Item modal="send">{'Send'}</Item>
              <Item modal="receive">{'Receive'}</Item>
              <Item linkTo="/settings">{'Settings'}</Item>
            </div>
          </Box>
          <Box flow={2}>
            <CapsSubtitle>{'Accounts'}</CapsSubtitle>
            <div>
              <Item linkTo="/account/brian" desc="BTC 3.78605936">
                {'Brian Account'}
              </Item>
              <Item linkTo="/account/virginie" desc="ETH 0.05944">
                {'Virginie Account'}
              </Item>
              <Item linkTo="/account/ledger" desc="DOGE 2.2658">
                {'Ledger Account'}
              </Item>
              <Item linkTo="/account/nicolas" desc="BTC 0.00015486">
                {'Nicolas Account'}
              </Item>
            </div>
          </Box>
        </Container>
      </Box>
    )
  }
}

export default SideBar

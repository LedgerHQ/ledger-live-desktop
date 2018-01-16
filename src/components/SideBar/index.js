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

const Container = styled(Box).attrs({
  noShrink: true,
})`
  background-color: ${p => rgba(p.theme.colors[p.bg], 0.4)};
  padding-top: 40px;
  width: 250px;
`

class SideBar extends PureComponent<{}> {
  render() {
    return (
      <Container>
        <GrowScroll flow={4} py={4}>
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
        </GrowScroll>
      </Container>
    )
  }
}

export default SideBar

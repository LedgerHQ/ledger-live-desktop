// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

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

class SideBar extends PureComponent<{}> {
  render() {
    return (
      <Box noShrink style={{ width: 250 }}>
        <GrowScroll flow={4} py={4} bg="night">
          <Box flow={2}>
            <CapsSubtitle>{'Menu'}</CapsSubtitle>
            <div>
              <Item linkTo="/">{'Dashboard'}</Item>
              <Item>{'Send'}</Item>
              <Item>{'Receive'}</Item>
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
      </Box>
    )
  }
}

export default SideBar

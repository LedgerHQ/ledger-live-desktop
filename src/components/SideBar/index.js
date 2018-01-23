// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'
import type { Accounts } from 'types/common'

import { openModal } from 'reducers/modals'
import { getAccounts } from 'reducers/accounts'

import { format } from 'helpers/btc'
import { rgba } from 'styles/helpers'

import Box, { GrowScroll } from 'components/base/Box'
import Item from './Item'

const CapsSubtitle = styled(Box).attrs({
  px: 2,
  fontSize: 0,
  color: 'shark',
})`
  cursor: default;
  text-transform: uppercase;
  font-weight: bold;
`

const Container = styled(Box).attrs({
  noShrink: true,
})`
  background-color: ${p => rgba(p.theme.colors[p.bg], process.platform === 'darwin' ? 0.4 : 1)};
  width: 250px;
`

const BtnAddAccount = styled(Box).attrs({
  align: 'center',
  color: 'steel',
})`
  border-radius: 5px;
  border: 1px dashed ${p => p.theme.colors.steel};
  cursor: pointer;
  margin: 30px 30px 0 30px;
  padding: 5px;
`

type Props = {
  accounts: Accounts,
  openModal: Function,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getAccounts(state),
})

const mapDispatchToProps = {
  openModal,
}

class SideBar extends PureComponent<Props> {
  render() {
    const { accounts, openModal } = this.props

    return (
      <Container bg="night">
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
              {Object.entries(accounts).map(([id, account]: [string, any]) => (
                <Item linkTo={`/account/${id}`} desc={format(account.data.balance)} key={id}>
                  {account.name}
                </Item>
              ))}
            </div>
          </Box>
          <BtnAddAccount onClick={() => openModal('add-account')}>{'Add account'}</BtnAddAccount>
        </GrowScroll>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  pure: false,
})(SideBar)

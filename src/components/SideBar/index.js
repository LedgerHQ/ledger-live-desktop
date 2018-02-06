// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { MODAL_SEND, MODAL_RECEIVE, MODAL_ADD_ACCOUNT } from 'constants'

import type { MapStateToProps } from 'react-redux'
import type { Accounts, T, Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'
import { openModal } from 'reducers/modals'
import { getVisibleAccounts } from 'reducers/accounts'

import { formatBTC } from 'helpers/format'

import Box, { Tabbable } from 'components/base/Box'
import Bar from 'components/base/Bar'
import GrowScroll from 'components/base/GrowScroll'
import Icon from 'components/base/Icon'
import Text from 'components/base/Text'
import Item from './Item'

const CapsSubtitle = styled(Box).attrs({
  px: 3,
  fontSize: 0,
  color: 'grey',
})`
  cursor: default;
  text-transform: uppercase;
  font-weight: bold;
`

const Container = styled(Box)`
  width: ${p => p.theme.sizes.sideBarWidth}px;
`

const Connected = styled(Box).attrs({
  bg: p => (p.state ? 'green' : 'grenade'),
  mx: 3,
})`
  border-radius: 50%;
  height: 10px;
  width: 10px;
`

const PlusBtn = styled(Tabbable).attrs({
  p: 1,
  m: -1,
})`
  cursor: pointer;
  outline: none;
  &:hover,
  &:focus {
    background: ${p => p.theme.colors.cream};
  }
  &:active {
    background: ${p => p.theme.colors.argile};
  }
`

type Props = {
  t: T,
  accounts: Accounts,
  openModal: Function,
  currentDevice: Device,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getVisibleAccounts(state),
  currentDevice: getCurrentDevice(state),
})

const mapDispatchToProps = {
  openModal,
}

class SideBar extends PureComponent<Props> {
  render() {
    const { t, accounts, openModal, currentDevice } = this.props

    return (
      <Container bg="white">
        <Box flow={3} pt={4} grow>
          <Box flow={2}>
            <CapsSubtitle>{t('sidebar.menu')}</CapsSubtitle>
            <Box px={2} flow={1}>
              <Item icon="chart-bar" linkTo="/">
                {t('dashboard.title')}
              </Item>
              <Item icon="upload" modal={MODAL_SEND}>
                {t('send.title')}
              </Item>
              <Item icon="download" modal={MODAL_RECEIVE}>
                {t('receive.title')}
              </Item>
              <Item icon="cog" linkTo="/settings">
                {t('settings.title')}
              </Item>
            </Box>
          </Box>
          <Bar color="cream" mx={3} size={2} />
          <Box flow={2} grow>
            <CapsSubtitle horizontal align="center">
              <Box grow>{t('sidebar.accounts')}</Box>
              <PlusBtn onClick={() => openModal(MODAL_ADD_ACCOUNT)}>
                <Icon name="plus-circle" />
              </PlusBtn>
            </CapsSubtitle>
            <GrowScroll pb={2} px={2} flow={1}>
              {Object.entries(accounts).map(([id, account]: [string, any]) => (
                <Item
                  linkTo={`/account/${id}`}
                  desc={formatBTC(account.data.balance)}
                  key={id}
                  icon={{ iconName: 'btc', prefix: 'fab' }}
                >
                  {account.name}
                </Item>
              ))}
            </GrowScroll>
          </Box>
        </Box>
        <Box borderColor="argile" borderWidth={1} borderTop horizontal py={2}>
          <Box align="center" justify="center">
            <Connected state={currentDevice !== null} />
          </Box>
          <Box>
            <Box>
              <Text fontSize={1}>Ledger Nano S</Text>
            </Box>
            <Box>
              <Text fontSize={0} color="grey">
                {t(currentDevice !== null ? 'device.connected' : 'device.notConnected')}
              </Text>
            </Box>
          </Box>
        </Box>
      </Container>
    )
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps, null, {
    pure: false,
  }),
  translate(),
)(SideBar)

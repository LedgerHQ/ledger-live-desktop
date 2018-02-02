// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { MODAL_SEND, MODAL_RECEIVE, MODAL_ADD_ACCOUNT } from 'constants'

import type { MapStateToProps } from 'react-redux'
import type { Accounts, T } from 'types/common'

import { openModal } from 'reducers/modals'
import { getVisibleAccounts } from 'reducers/accounts'

import { formatBTC } from 'helpers/format'

import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Icon from 'components/base/Icon'
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
  width: ${p => p.theme.sizes.sideBarWidth}px;
`

type Props = {
  t: T,
  accounts: Accounts,
  openModal: Function,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getVisibleAccounts(state),
})

const mapDispatchToProps = {
  openModal,
}

class SideBar extends PureComponent<Props> {
  render() {
    const { t, accounts, openModal } = this.props

    return (
      <Container bg="white">
        <Box flow={4} pt={4} grow>
          <Box flow={2}>
            <CapsSubtitle>{t('sidebar.menu')}</CapsSubtitle>
            <div>
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
            </div>
          </Box>
          <Box flow={2} grow>
            <CapsSubtitle horizontal align="center">
              <Box grow>{t('sidebar.accounts')}</Box>
              <Box>
                <Icon
                  name="plus-circle"
                  style={{ cursor: 'pointer' }}
                  onClick={() => openModal(MODAL_ADD_ACCOUNT)}
                />
              </Box>
            </CapsSubtitle>
            <GrowScroll pb={2}>
              {Object.entries(accounts).map(([id, account]: [string, any]) => (
                <Item linkTo={`/account/${id}`} desc={formatBTC(account.data.balance)} key={id}>
                  {account.name}
                </Item>
              ))}
            </GrowScroll>
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

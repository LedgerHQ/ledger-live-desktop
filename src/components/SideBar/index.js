// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getCryptoCurrencyIcon } from '@ledgerhq/live-common/lib/react'
import type { Account } from '@ledgerhq/live-common/lib/types'

import { MODAL_SEND, MODAL_RECEIVE } from 'config/constants'

import type { T } from 'types/common'

import { openModal } from 'reducers/modals'
import { getVisibleAccounts } from 'reducers/accounts'
import { getUpdateStatus } from 'reducers/update'
import type { UpdateStatus } from 'reducers/update'

import IconManager from 'icons/Manager'
import IconPieChart from 'icons/PieChart'
import IconPlus from 'icons/Plus'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'
import IconExchange from 'icons/Exchange'

import Box, { Tabbable } from 'components/base/Box'
import FormattedVal from 'components/base/FormattedVal'
import GrowScroll from 'components/base/GrowScroll'
import Tooltip from 'components/base/Tooltip'

import Item from './Item'

const CapsSubtitle = styled(Box).attrs({
  color: 'dark',
  ff: 'Museo Sans|ExtraBold',
  fontSize: 1,
  px: 4,
})`
  cursor: default;
  letter-spacing: 2px;
  text-transform: uppercase;
`

const Container = styled(Box)`
  width: ${p => p.theme.sizes.sideBarWidth}px;
`

const PlusBtn = styled(Tabbable).attrs({
  p: 1,
  m: -1,
})`
  cursor: pointer;
  outline: none;
`

type Props = {
  t: T,
  openModal: Function,
  updateStatus: UpdateStatus,
}

const mapStateToProps = state => ({
  accounts: getVisibleAccounts(state),
  updateStatus: getUpdateStatus(state),
})

const mapDispatchToProps: Object = {
  openModal,
}

class SideBar extends PureComponent<Props> {
  render() {
    const { t, openModal, updateStatus } = this.props

    return (
      <Container bg="white">
        <Box flow={7} pt={8} grow>
          <Box flow={4}>
            <CapsSubtitle>{t('sidebar:menu')}</CapsSubtitle>
            <Box px={4} flow={2}>
              <Item icon={<IconPieChart size={16} />} linkTo="/" highlight={updateStatus === 'downloaded'}>
                {t('dashboard:title')}
              </Item>
              <Item icon={<IconSend size={16} />} modal={MODAL_SEND}>
                {t('send:title')}
              </Item>
              <Item icon={<IconReceive size={16} />} modal={MODAL_RECEIVE}>
                {t('receive:title')}
              </Item>
              <Item icon={<IconManager size={16} />} linkTo="/manager">
                {t('sidebar:manager')}
              </Item>
              <Item icon={<IconExchange size={16} />} linkTo="/exchange">
                {t('sidebar:exchange')}
              </Item>
            </Box>
          </Box>
          <Box flow={4} grow pt={1}>
            <CapsSubtitle horizontal alignItems="center">
              <Box grow>{t('sidebar:accounts')}</Box>
              <Tooltip render={() => t('addAccount:title')}>
                <PlusBtn onClick={() => openModal('importAccounts')}>
                  <IconPlus size={16} />
                </PlusBtn>
              </Tooltip>
            </CapsSubtitle>
            <GrowScroll pb={4} px={4} flow={2}>
              <AccountsList />
            </GrowScroll>
          </Box>
        </Box>
      </Container>
    )
  }
}

const AccountsList = connect(state => ({
  accounts: getVisibleAccounts(state),
}))(({ accounts }: { accounts: Account[] }) => (
  <Fragment>
    {accounts.map(account => {
      const Icon = getCryptoCurrencyIcon(account.currency)
      return (
        <Item
          big
          desc={
            <FormattedVal
              alwaysShowSign={false}
              color="graphite"
              unit={account.unit}
              showCode
              val={account.balance || 0}
            />
          }
          iconActiveColor={account.currency.color}
          icon={Icon ? <Icon size={16} /> : null}
          key={account.id}
          linkTo={`/account/${account.id}`}
        >
          {account.name}
        </Item>
      )
    })}
  </Fragment>
))

export default compose(
  connect(mapStateToProps, mapDispatchToProps, null, { pure: false }),
  translate(),
)(SideBar)

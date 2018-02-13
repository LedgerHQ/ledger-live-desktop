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

import IconPieChart from 'icons/PieChart'
import IconArrowDown from 'icons/ArrowDown'
import IconArrowUp from 'icons/ArrowUp'
import IconSettings from 'icons/Settings'
import IconPlus from 'icons/Plus'
import IconCurrencyBitcoin from 'icons/currencies/Bitcoin'

import Box, { Tabbable } from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import FormattedVal from 'components/base/FormattedVal'
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
        <Box flow={7} pt={8} grow>
          <Box flow={4}>
            <CapsSubtitle>{t('sidebar.menu')}</CapsSubtitle>
            <Box px={4} flow={2}>
              <Item icon={<IconPieChart height={16} width={16} />} linkTo="/">
                {t('dashboard.title')}
              </Item>
              <Item icon={<IconArrowUp height={16} width={16} />} modal={MODAL_SEND}>
                {t('send.title')}
              </Item>
              <Item icon={<IconArrowDown height={16} width={16} />} modal={MODAL_RECEIVE}>
                {t('receive.title')}
              </Item>
              <Item icon={<IconSettings height={16} width={16} />} linkTo="/settings">
                {t('settings.title')}
              </Item>
            </Box>
          </Box>
          <Box flow={4} grow pt={1}>
            <CapsSubtitle horizontal align="center">
              <Box grow>{t('sidebar.accounts')}</Box>
              <PlusBtn onClick={() => openModal(MODAL_ADD_ACCOUNT)}>
                <IconPlus height={14} width={14} />
              </PlusBtn>
            </CapsSubtitle>
            <GrowScroll pb={4} px={4} flow={2}>
              {accounts.map(account => (
                <Item
                  big
                  desc={
                    <FormattedVal
                      alwaysShowSign={false}
                      color="warmGrey"
                      currency={account.type}
                      showCode
                      val={account.data ? account.data.balance : 0}
                    />
                  }
                  iconActiveColor="#fcb653"
                  icon={<IconCurrencyBitcoin height={16} width={16} />}
                  key={account.id}
                  linkTo={`/account/${account.id}`}
                >
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

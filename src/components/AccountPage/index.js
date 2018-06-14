// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router'
import styled from 'styled-components'
import type { Currency, Account } from '@ledgerhq/live-common/lib/types'
import SyncOneAccountOnMount from 'components/SyncOneAccountOnMount'
import Tooltip from 'components/base/Tooltip'

import { MODAL_SEND, MODAL_RECEIVE, MODAL_SETTINGS_ACCOUNT } from 'config/constants'

import type { T } from 'types/common'

import { rgba } from 'styles/helpers'

import { accountSelector } from 'reducers/accounts'
import { counterValueCurrencySelector, localeSelector } from 'reducers/settings'
import { openModal } from 'reducers/modals'

import IconAccountSettings from 'icons/AccountSettings'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'

import BalanceSummary from 'components/BalanceSummary'
import {
  BalanceTotal,
  BalanceSinceDiff,
  BalanceSincePercent,
} from 'components/BalanceSummary/BalanceInfos'
import Box, { Tabbable } from 'components/base/Box'
import Button from 'components/base/Button'
import FormattedVal from 'components/base/FormattedVal'
import PillsDaysCount from 'components/PillsDaysCount'
import OperationsList from 'components/OperationsList'
import StickyBackToTop from 'components/StickyBackToTop'

import AccountHeader from './AccountHeader'
import EmptyStateAccount from './EmptyStateAccount'

const ButtonSettings = styled(Tabbable).attrs({
  cursor: 'pointer',
  align: 'center',
  justify: 'center',
  borderRadius: 1,
})`
  width: 40px;
  height: 40px;

  &:hover {
    color: ${p => (p.disabled ? '' : p.theme.colors.dark)};
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.fog, 0.2))};
  }

  &:active {
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.fog, 0.3))};
  }
`

const mapStateToProps = (state, props) => ({
  account: accountSelector(state, { accountId: props.match.params.id }),
  counterValue: counterValueCurrencySelector(state),
  settings: localeSelector(state),
})

const mapDispatchToProps = {
  openModal,
}

type Props = {
  counterValue: Currency,
  t: T,
  account?: Account,
  openModal: Function,
}

type State = {
  selectedTime: string,
  daysCount: number,
}

class AccountPage extends PureComponent<Props, State> {
  state = {
    selectedTime: 'month',
    daysCount: 30,
  }

  handleChangeSelectedTime = item =>
    this.setState({
      selectedTime: item.key,
      daysCount: item.value,
    })

  _cacheBalance = null

  render() {
    const { account, openModal, t, counterValue } = this.props
    const { selectedTime, daysCount } = this.state

    // Don't even throw if we jumped in wrong account route
    if (!account) {
      return <Redirect to="/" />
    }

    return (
      // Force re-render account page, for avoid animation
      <Box key={account.id}>
        <SyncOneAccountOnMount priority={10} accountId={account.id} />
        <Box horizontal mb={5} flow={4}>
          <AccountHeader account={account} />
          <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
            {account.operations.length > 0 && (
              <Fragment>
                <Button small primary onClick={() => openModal(MODAL_SEND, { account })}>
                  <Box horizontal flow={1} alignItems="center">
                    <IconSend size={12} />
                    <Box>{t('app:send.title')}</Box>
                  </Box>
                </Button>

                <Button small primary onClick={() => openModal(MODAL_RECEIVE, { account })}>
                  <Box horizontal flow={1} alignItems="center">
                    <IconReceive size={12} />
                    <Box>{t('app:receive.title')}</Box>
                  </Box>
                </Button>
              </Fragment>
            )}
            <Tooltip render={() => t('app:account.settings.title')}>
              <ButtonSettings onClick={() => openModal(MODAL_SETTINGS_ACCOUNT, { account })}>
                <Box align="center">
                  <IconAccountSettings size={16} />
                </Box>
              </ButtonSettings>
            </Tooltip>
          </Box>
        </Box>
        {account.operations.length > 0 ? (
          <Fragment>
            <Box mb={7}>
              <BalanceSummary
                accounts={[account]}
                chartColor={account.currency.color}
                chartId={`account-chart-${account.id}`}
                counterValue={counterValue}
                daysCount={daysCount}
                selectedTime={selectedTime}
                renderHeader={({ totalBalance, sinceBalance, refBalance }) => (
                  <Box flow={4} mb={2}>
                    <Box horizontal>
                      <BalanceTotal totalBalance={account.balance} unit={account.unit}>
                        <FormattedVal
                          animateTicker
                          alwaysShowSign={false}
                          color="warmGrey"
                          unit={counterValue.units[0]}
                          fontSize={6}
                          showCode
                          val={totalBalance}
                        />
                      </BalanceTotal>
                      <Box>
                        <PillsDaysCount
                          selectedTime={selectedTime}
                          onChange={this.handleChangeSelectedTime}
                        />
                      </Box>
                    </Box>
                    <Box horizontal justifyContent="center" flow={7}>
                      <BalanceSincePercent
                        t={t}
                        alignItems="center"
                        totalBalance={totalBalance}
                        sinceBalance={sinceBalance}
                        refBalance={refBalance}
                        since={selectedTime}
                      />
                      <BalanceSinceDiff
                        t={t}
                        counterValue={counterValue}
                        alignItems="center"
                        totalBalance={totalBalance}
                        sinceBalance={sinceBalance}
                        refBalance={refBalance}
                        since={selectedTime}
                      />
                    </Box>
                  </Box>
                )}
              />
            </Box>
            <OperationsList account={account} title={t('app:account.lastOperations')} />
            <StickyBackToTop />
          </Fragment>
        ) : (
          <EmptyStateAccount account={account} />
        )}
      </Box>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(AccountPage)

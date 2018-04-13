// @flow

import React, { PureComponent } from 'react'
import { ipcRenderer } from 'electron'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router'
import styled from 'styled-components'
import { formatCurrencyUnit, getFiatUnit } from '@ledgerhq/currencies'

import type { Account } from '@ledgerhq/wallet-common/lib/types'

import { MODAL_SEND, MODAL_RECEIVE, MODAL_SETTINGS_ACCOUNT } from 'config/constants'

import type { T } from 'types/common'

import { darken } from 'styles/helpers'

import { getAccountById } from 'reducers/accounts'
import { getCounterValueCode } from 'reducers/settings'
import { openModal } from 'reducers/modals'

import IconControls from 'icons/Controls'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'

import BalanceSummary from 'components/BalanceSummary'
import {
  BalanceTotal,
  BalanceSinceDiff,
  BalanceSincePercent,
} from 'components/BalanceSummary/BalanceInfos'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import FormattedVal from 'components/base/FormattedVal'
import PillsDaysCount from 'components/PillsDaysCount'
import OperationsList from 'components/OperationsList'

import AccountHeader from './AccountHeader'

const ButtonSettings = styled(Button).attrs({
  small: true,
})`
  border: 2px solid ${p => p.theme.colors.grey};
  width: 30px;
  padding: 0;

  &:active {
    border: 2px solid ${p => darken(p.theme.colors.grey, 0.2)};
  }
`

const mapStateToProps = (state, props) => ({
  account: getAccountById(state, props.match.params.id),
  counterValue: getCounterValueCode(state),
})

const mapDispatchToProps = {
  openModal,
}

type Props = {
  counterValue: string,
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
    selectedTime: 'week',
    daysCount: 7,
  }

  handleCalculateBalance = data => {
    const { counterValue, account } = this.props

    if (!account) {
      return
    }

    if (process.platform === 'darwin') {
      ipcRenderer.send('touch-bar-update', {
        text: account.name,
        color: account.currency.color,
        balance: {
          currency: formatCurrencyUnit(account.unit, account.balance, {
            showCode: true,
          }),
          counterValue: formatCurrencyUnit(getFiatUnit(counterValue), data.totalBalance, {
            showCode: true,
          }),
        },
      })
    }
  }

  handleChangeSelectedTime = item =>
    this.setState({
      selectedTime: item.key,
      daysCount: item.value,
    })

  render() {
    const { account, openModal, t, counterValue } = this.props
    const { selectedTime, daysCount } = this.state

    // Don't even throw if we jumped in wrong account route
    if (!account) {
      return <Redirect to="/" />
    }

    return (
      <Box>
        <Box horizontal mb={5}>
          <AccountHeader account={account} />
          <Box horizontal alignItems="center" justifyContent="flex-end" grow flow={2}>
            <Button small primary onClick={() => openModal(MODAL_SEND, { account })}>
              <Box horizontal flow={1} alignItems="center">
                <IconSend size={12} />
                <Box>{t('send:title')}</Box>
              </Box>
            </Button>
            <Button small primary onClick={() => openModal(MODAL_RECEIVE, { account })}>
              <Box horizontal flow={1} alignItems="center">
                <IconReceive size={12} />
                <Box>{t('receive:title')}</Box>
              </Box>
            </Button>
            <ButtonSettings onClick={() => openModal(MODAL_SETTINGS_ACCOUNT, { account })}>
              <Box align="center">
                <IconControls size={16} />
              </Box>
            </ButtonSettings>
          </Box>
        </Box>
        <Box mb={7}>
          <BalanceSummary
            accounts={[account]}
            chartColor={account.currency.color}
            chartId={`account-chart-${account.id}`}
            counterValue={counterValue}
            daysCount={daysCount}
            onCalculate={this.handleCalculateBalance}
            selectedTime={selectedTime}
            renderHeader={({ totalBalance, sinceBalance, refBalance }) => (
              <Box flow={4} mb={2}>
                <Box horizontal>
                  <BalanceTotal totalBalance={account.balance} unit={account.unit}>
                    <Box mt={1}>
                      <FormattedVal
                        animateTicker
                        alwaysShowSign={false}
                        color="warmGrey"
                        fiat={counterValue}
                        fontSize={6}
                        showCode
                        val={totalBalance}
                      />
                    </Box>
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
        <OperationsList account={account} title={t('account:lastOperations')} />
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AccountPage)

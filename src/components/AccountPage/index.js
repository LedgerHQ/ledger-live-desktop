// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router'

import { MODAL_SEND, MODAL_RECEIVE, MODAL_SETTINGS_ACCOUNT } from 'constants'

import type { MapStateToProps } from 'react-redux'
import type { T, Account } from 'types/common'

import { getAccountById } from 'reducers/accounts'
import { openModal } from 'reducers/modals'

import IconControls from 'icons/Controls'
import IconArrowDown from 'icons/ArrowDown'
import IconArrowUp from 'icons/ArrowUp'

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
import TransactionsList from 'components/TransactionsList'

import AccountHeader from './AccountHeader'

const mapStateToProps: MapStateToProps<*, *, *> = (state, props) => ({
  account: getAccountById(state, props.match.params.id),
})

const mapDispatchToProps = {
  openModal,
}

type Props = {
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

  handleChangeSelectedTime = item =>
    this.setState({
      selectedTime: item.key,
      daysCount: item.value,
    })

  render() {
    const { account, openModal, t } = this.props
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
            <Button primary onClick={() => openModal(MODAL_SEND, { account })}>
              <Box horizontal flow={1} alignItems="center">
                <IconArrowUp width={12} />
                <Box>{t('send:title')}</Box>
              </Box>
            </Button>
            <Button primary onClick={() => openModal(MODAL_RECEIVE, { account })}>
              <Box horizontal flow={1} alignItems="center">
                <IconArrowDown width={12} />
                <Box>{t('receive:title')}</Box>
              </Box>
            </Button>
            <Button
              style={{ width: 30, padding: 0 }}
              onClick={() => openModal(MODAL_SETTINGS_ACCOUNT, { account })}
            >
              <Box align="center">
                <IconControls width={16} />
              </Box>
            </Button>
          </Box>
        </Box>
        <Box mb={7}>
          <BalanceSummary
            chartColor={account.currency.color}
            chartId={`account-chart-${account.id}`}
            accounts={[account]}
            selectedTime={selectedTime}
            daysCount={daysCount}
            renderHeader={({ totalBalance, sinceBalance }) => (
              <Box flow={4} mb={2}>
                <Box horizontal>
                  <BalanceTotal totalBalance={account.balance} unit={account.unit}>
                    <Box mt={1}>
                      <FormattedVal
                        alwaysShowSign={false}
                        color="warmGrey"
                        fiat="USD"
                        fontSize={6}
                        showCode
                        style={{ lineHeight: 1 }}
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
                    since={selectedTime}
                  />
                  <BalanceSinceDiff
                    t={t}
                    fiat="USD"
                    alignItems="center"
                    totalBalance={totalBalance}
                    sinceBalance={sinceBalance}
                    since={selectedTime}
                  />
                </Box>
              </Box>
            )}
          />
        </Box>
        <TransactionsList
          title={t('account:lastOperations')}
          transactions={account.transactions}
          minConfirmations={account.settings.minConfirmations}
        />
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AccountPage)

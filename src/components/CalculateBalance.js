// @flow
/* eslint-disable react/no-unused-prop-types */

import { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { Account, BalanceHistory } from '@ledgerhq/live-common/lib/types'
import { getBalanceHistorySum } from '@ledgerhq/live-common/lib/helpers/account'
import CounterValues from 'helpers/countervalues'
import { exchangeSettingsForAccountSelector, counterValueCurrencySelector } from 'reducers/settings'
import type { State } from 'reducers'

type OwnProps = {
  accounts: Account[],
  daysCount: number,
  children: Props => *,
}

type Props = OwnProps & {
  balanceHistory: BalanceHistory,
  balanceStart: number,
  balanceEnd: number,
  isAvailable: boolean,
}

const mapStateToProps = (state: State, props: OwnProps) => {
  const counterValueCurrency = counterValueCurrencySelector(state)
  let isAvailable = true
  const balanceHistory = getBalanceHistorySum(
    props.accounts,
    props.daysCount,
    (account, value, date) => {
      const cv = CounterValues.calculateSelector(state, {
        value,
        date,
        to: counterValueCurrency,
        from: account.currency,
        exchange: exchangeSettingsForAccountSelector(state, { account }),
      })
      if (!cv && cv !== 0) {
        isAvailable = false
        return 0
      }
      return cv
    },
  )
  return {
    isAvailable,
    balanceHistory,
    balanceStart: balanceHistory[0].value,
    balanceEnd: balanceHistory[balanceHistory.length - 1].value,
  }
}

class CalculateBalance extends PureComponent<Props> {
  render() {
    const { children } = this.props
    return children(this.props)
  }
}

export default connect(mapStateToProps)(CalculateBalance)

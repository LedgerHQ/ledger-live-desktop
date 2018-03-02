// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import type { MapStateToProps } from 'react-redux'
import type { Accounts } from 'types/common'

import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import first from 'lodash/first'
import get from 'lodash/get'
import last from 'lodash/last'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  counterValues: state.counterValues,
})

function getAllBalances({
  accounts,
  counterValues,
  daysCount,
}: {
  accounts: Accounts,
  counterValues: Object,
  daysCount: number,
}) {
  const getDate = date => moment(date).format('YYYY-MM-DD')
  const getValue = (balance, unit, d) =>
    balance / 10 ** unit.magnitude * counterValues['BTC-USD'][d]

  const allBalancesByCoinType = accounts.reduce((result, account) => {
    const { coinType } = account

    Object.keys(account.balanceByDay).forEach(k => {
      if (!result[coinType]) {
        result[coinType] = {}
      }
      result[coinType][k] = account.balanceByDay[k] + get(result, `${coinType}.${k}`, 0)
    })

    return result
  }, {})

  const allBalances = Object.keys(allBalancesByCoinType).reduce((result, coinType) => {
    const unit = getDefaultUnitByCoinType(parseInt(coinType, 10))

    const balanceByDay = allBalancesByCoinType[coinType]

    const balanceByDayKeys = Object.keys(balanceByDay).sort((a, b) => new Date(b) - new Date(a))

    const lastDay = balanceByDayKeys[0]
    const lastBalance = balanceByDay[lastDay]

    let balance = lastBalance
    let index = daysCount

    result[lastDay] = getValue(balance, unit, lastDay)

    let d = getDate(moment(lastDay).subtract(1, 'days'))

    while (index !== 0) {
      result[d] = getValue(balance, unit, d) + (result[d] || 0)
      d = getDate(moment(d).subtract(1, 'days'))

      if (balanceByDay[d]) {
        balance = balanceByDay[d]
      }

      index--
    }

    return result
  }, {})

  return Object.keys(allBalances)
    .sort()
    .map(k => ({
      name: k,
      value: allBalances[k],
    }))
}

function calculateBalance(props) {
  const allBalances = getAllBalances({
    accounts: props.accounts,
    counterValues: props.counterValues,
    daysCount: props.daysCount,
  })

  return {
    allBalances,
    totalBalance: last(allBalances).value,
    sinceBalance: first(allBalances).value,
  }
}

type Props = {
  accounts: Accounts,
  counterValues: Object,
  daysCount: number,
  render: Function,
}

type State = {
  allBalances: Array<Object>,
  totalBalance: number,
  sinceBalance: number,
}

class CalculateBalance extends PureComponent<Props, State> {
  state = {
    ...calculateBalance(this.props),
  }

  componentWillReceiveProps(nextProps) {
    const sameAccounts = this.props.accounts === nextProps.accounts
    const sameCounterValues = this.props.counterValues === nextProps.counterValues
    const sameDaysCount = this.props.daysCount === nextProps.daysCount

    if (!sameAccounts || !sameCounterValues || !sameDaysCount) {
      this.setState({
        ...calculateBalance(nextProps),
      })
    }
  }

  render() {
    const { render } = this.props
    const { allBalances, totalBalance, sinceBalance } = this.state

    return render({ allBalances, totalBalance, sinceBalance })
  }
}

export default connect(mapStateToProps)(CalculateBalance)

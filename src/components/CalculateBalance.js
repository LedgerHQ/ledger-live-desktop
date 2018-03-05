// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import find from 'lodash/find'
import last from 'lodash/last'

import type { MapStateToProps } from 'react-redux'
import type { Accounts } from 'types/common'

import { getBalanceHistoryForAccounts } from 'helpers/balance'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  counterValues: state.counterValues,
})

function calculateBalance(props) {
  const interval = {
    start: moment()
      .subtract(props.daysCount, 'days')
      .format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  }

  const allBalances = getBalanceHistoryForAccounts({
    fiat: 'USD',
    accounts: props.accounts,
    counterValues: props.counterValues,
    interval,
  }).map(e => ({ name: e.date, value: e.balance }))

  const firstNonEmptyDay = find(allBalances, e => e.value)
  const sinceBalance = firstNonEmptyDay ? firstNonEmptyDay.value : 0

  return {
    allBalances,
    totalBalance: last(allBalances).value,
    sinceBalance,
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

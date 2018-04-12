// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'

import noop from 'lodash/noop'

import type { Account } from '@ledgerhq/wallet-common/lib/types'

import calculateBalance from 'helpers/balance'

const mapStateToProps = state => ({
  counterValues: state.counterValues,
})

type Props = {
  accounts: Account[],
  counterValues: Object,
  daysCount: number,
  onCalculate: Function,
  render: Function,
}

type State = {
  allBalances: Array<Object>,
  totalBalance: number,
  sinceBalance: number,
  refBalance: number,
}

function calculateBalanceToState(props: Object) {
  const { accounts, counterValue, counterValues, daysCount } = props

  return {
    ...calculateBalance({ accounts, counterValue, counterValues, daysCount }),
  }
}

class CalculateBalance extends PureComponent<Props, State> {
  static defaultProps = {
    onCalculate: noop,
  }

  state = calculateBalanceToState(this.props)

  componentDidMount() {
    this.props.onCalculate(this.state)
  }

  componentWillReceiveProps(nextProps) {
    const sameAccounts = this.props.accounts === nextProps.accounts
    const sameCounterValues = this.props.counterValues === nextProps.counterValues
    const sameDaysCount = this.props.daysCount === nextProps.daysCount
    if (!sameAccounts || !sameCounterValues || !sameDaysCount) {
      const state = calculateBalanceToState(nextProps)
      nextProps.onCalculate(state)
      this.setState(state)
    }
  }

  render() {
    const { render } = this.props
    const { allBalances, totalBalance, sinceBalance, refBalance } = this.state

    return render({ allBalances, totalBalance, sinceBalance, refBalance })
  }
}

export default connect(mapStateToProps)(CalculateBalance)

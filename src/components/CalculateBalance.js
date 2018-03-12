// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { Accounts } from 'types/common'

import calculateBalance from 'helpers/balance'

const mapStateToProps = state => ({
  counterValues: state.counterValues,
})

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
  refBalance: number,
}

function calculateBalanceToState(props: Object) {
  const { accounts, counterValue, counterValues, daysCount } = props

  return {
    ...calculateBalance({ accounts, counterValue, counterValues, daysCount }),
  }
}

class CalculateBalance extends PureComponent<Props, State> {
  state = calculateBalanceToState(this.props)

  componentWillReceiveProps(nextProps) {
    const sameAccounts = this.props.accounts === nextProps.accounts
    const sameCounterValues = this.props.counterValues === nextProps.counterValues
    const sameDaysCount = this.props.daysCount === nextProps.daysCount

    if (!sameAccounts || !sameCounterValues || !sameDaysCount) {
      this.setState(calculateBalanceToState(nextProps))
    }
  }

  render() {
    const { render } = this.props
    const { allBalances, totalBalance, sinceBalance, refBalance } = this.state

    return render({ allBalances, totalBalance, sinceBalance, refBalance })
  }
}

export default connect(mapStateToProps)(CalculateBalance)

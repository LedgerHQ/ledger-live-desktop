// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import Text from 'components/base/Text'
import Card from 'components/base/Box/Card'
import { counterValueCurrencySelector } from 'reducers/settings'
import Row from './Row'
import Header from './Header'
import type { AccountDistributionItem } from './Row'
import { calculateCountervalueSelector } from '../../actions/general'

type Props = {
  accountDistribution: AccountDistributionItem[],
}

type State = {}

const mapStateToProps = (state, props) => {
  const { accounts } = props
  const total = accounts.reduce((total, a) => total.plus(a.balance), BigNumber(0))

  return {
    accountDistribution: accounts.map(a => ({
      account: a,
      currency: a.type === 'Account' ? a.currency : a.token,
      distribution: a.balance.div(total).toFixed(2),
      amount: a.balance,
      countervalue: calculateCountervalueSelector(state)(
        a.type === 'Account' ? a.currency : a.token,
        a.balance,
      ),
    })),
    counterValueCurrency: counterValueCurrencySelector,
  }
}

class AccountDistribution extends PureComponent<Props, State> {
  render() {
    const { accountDistribution } = this.props
    return (
      <>
        <Text ff="Museo Sans|Regular" fontSize={6} color="dark">
          <Trans
            i18nKey="accountDistribution.header"
            values={{ count: accountDistribution.length }}
            count={accountDistribution.length}
          />
        </Text>
        <Card p={0} mt={20}>
          <Header />
          {accountDistribution.map(item => (
            <Row key={item.account.id} item={item} />
          ))}
        </Card>
      </>
    )
  }
}

export default connect(mapStateToProps)(AccountDistribution)

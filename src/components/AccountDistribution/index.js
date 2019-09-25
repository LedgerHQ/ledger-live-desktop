// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import Text from 'components/base/Text'
import Card from 'components/base/Box/Card'
import { counterValueCurrencySelector } from 'reducers/settings'
import styled from 'styled-components'
import Box from 'components/base/Box'
import Tag from 'components/Tag'
import Header from './Header'
import Row from './Row'
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

const TagWrapper = styled.div`
  margin-left: 16px;
  margin-right: 8px;
`

class AccountDistribution extends PureComponent<Props, State> {
  render() {
    const { accountDistribution } = this.props
    return (
      <>
        <Box horizontal alignItems="center">
          <Text ff="Museo Sans|Regular" fontSize={6} color="palette.text.shade100">
            <Trans
              i18nKey="accountDistribution.header"
              values={{ count: accountDistribution.length }}
              count={accountDistribution.length}
            />
          </Text>
          <TagWrapper>
            <Tag>
              <Trans i18nKey="common.new" />
            </Tag>
          </TagWrapper>
          <Text ff="Open Sans|SemiBold" fontSize={12} color="wallet">
            <Trans i18nKey="accountDistribution.notice" />
          </Text>
        </Box>

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

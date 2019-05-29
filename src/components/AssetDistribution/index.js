// @flow

import React, { PureComponent } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Trans } from 'react-i18next'
import { getAssetsDistribution } from '@ledgerhq/live-common/lib/portfolio'
import type { Currency } from '@ledgerhq/live-common/lib/types/currencies'
import type { AssetsDistribution } from '@ledgerhq/live-common/lib/types/portfolio'
import styled from 'styled-components'
import Button from 'components/base/Button'
import Text from 'components/base/Text'
import CounterValues from 'helpers/countervalues'
import IconAngleDown from 'icons/AngleDown'
import Card from '../base/Box/Card'
import { accountsSelector } from '../../reducers/accounts'
import {
  counterValueCurrencySelector,
  counterValueExchangeSelector,
  currencySettingsSelector,
  intermediaryCurrency,
} from '../../reducers/settings'
import Row from './Row'
import Header from './Header'

type Props = {
  distribution: AssetsDistribution,
}

type State = {
  showAll: boolean,
}

const SeeAllButton = styled(Button)`
  margin: 16px;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.fog};
  cursor: pointer;
  align-items: center;
  display: flex;
  justify-content: center;
  > :first-child {
    margin-right: 6px;
  }
`

const mapStateToProps = createStructuredSelector({
  distribution: state => {
    const accounts = accountsSelector(state)
    const counterValueCurrency = counterValueCurrencySelector(state)
    const toExchange = counterValueExchangeSelector(state)
    return getAssetsDistribution(accounts, (currency: Currency, value) => {
      // $FlowFixMe
      const currencySettings = currencySettingsSelector(state, { currency })
      const fromExchange = currencySettings.exchange
      return CounterValues.calculateWithIntermediarySelector(state, {
        from: currency,
        fromExchange,
        intermediary: intermediaryCurrency,
        toExchange,
        to: counterValueCurrency,
        value,
        disableRounding: true,
      })
    })
  },
  counterValueCurrency: counterValueCurrencySelector,
})

class AssetDistribution extends PureComponent<Props, State> {
  state = {
    showAll: false,
  }
  render() {
    const { distribution } = this.props
    const { showAll } = this.state
    const subList = showAll ? distribution.list : distribution.list.slice(0, distribution.showFirst)

    return (
      <>
        <Text ff="Museo Sans|Regular" fontSize={6} color="dark">
          <Trans i18nKey="distribution.header" values={{ count: 0 }} count={subList.length} />
        </Text>
        <Card p={0} mt={20}>
          <Header />
          {subList.map(item => <Row key={item.currency.id} item={item} />)}
          {!showAll && (
            <SeeAllButton onClick={() => this.setState({ showAll: true })}>
              <Text ff="Open Sans|SemiBold" color="grey" fontSize={3}>
                <Trans i18nKey="distribution.seeAll" />
              </Text>{' '}
              <IconAngleDown size={12} />
            </SeeAllButton>
          )}
        </Card>
      </>
    )
  }
}

export default connect(mapStateToProps)(AssetDistribution)

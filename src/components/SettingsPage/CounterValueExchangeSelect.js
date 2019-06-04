// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  counterValueCurrencySelector,
  counterValueExchangeSelector,
  intermediaryCurrency,
} from 'reducers/settings'
import { setCounterValueExchange } from 'actions/settings'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import SelectExchange from 'components/SelectExchange'
import Track from 'analytics/Track'

type Props = {
  counterValueCurrency: Currency,
  counterValueExchange: ?string,
  setCounterValueExchange: (?string) => void,
}

class CounterValueExchangeSelect extends PureComponent<Props> {
  handleChangeExchange = (exchange: *) =>
    this.props.setCounterValueExchange(exchange ? exchange.id : null)

  render() {
    const { counterValueCurrency, counterValueExchange } = this.props

    return counterValueCurrency ? (
      <Fragment>
        <Track onUpdate event="CounterValueExchangeSelect" exchangeId={counterValueExchange} />
        <SelectExchange
          small
          from={intermediaryCurrency}
          to={counterValueCurrency}
          exchangeId={counterValueExchange}
          onChange={this.handleChangeExchange}
          minWidth={260}
        />
      </Fragment>
    ) : null
  }
}

export default connect(
  createStructuredSelector({
    counterValueCurrency: counterValueCurrencySelector,
    counterValueExchange: counterValueExchangeSelector,
  }),
  {
    setCounterValueExchange,
  },
)(CounterValueExchangeSelect)

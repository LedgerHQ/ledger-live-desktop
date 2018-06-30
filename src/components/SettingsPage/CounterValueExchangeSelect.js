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

    return (
      <Fragment>
        {counterValueCurrency ? (
          <SelectExchange
            small
            from={intermediaryCurrency}
            to={counterValueCurrency}
            exchangeId={counterValueExchange}
            onChange={this.handleChangeExchange}
            minWidth={200}
          />
        ) : null}
      </Fragment>
    )
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

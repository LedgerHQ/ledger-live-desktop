// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { listFiatCurrencies } from '@ledgerhq/live-common/lib/currencies'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { setCounterValue } from 'actions/settings'
import { counterValueCurrencySelector } from 'reducers/settings'
import Select from 'components/base/Select'
import Track from 'analytics/Track'

const fiats = listFiatCurrencies()
  .map(f => f.units[0])
  // For now we take first unit, in the future we'll need to figure out something else
  .map(fiat => ({
    value: fiat.code,
    label: `${fiat.name} - ${fiat.code}${fiat.symbol ? ` (${fiat.symbol})` : ''}`,
    fiat,
  }))

type Props = {
  counterValueCurrency: Currency,
  setCounterValue: string => void,
}

class CounterValueSelect extends PureComponent<Props> {
  handleChangeCounterValue = (item: Object) => {
    const { setCounterValue } = this.props
    setCounterValue(item.fiat.code)
  }

  render() {
    const { counterValueCurrency } = this.props
    const cvOption = fiats.find(f => f.value === counterValueCurrency.ticker)

    return (
      <Fragment>
        <Track onUpdate event="CounterValueSelect" counterValue={cvOption && cvOption.value} />
        <Select
          small
          minWidth={250}
          onChange={this.handleChangeCounterValue}
          itemToString={item => (item ? item.name : '')}
          renderSelected={item => item && item.name}
          options={fiats}
          value={cvOption}
        />
      </Fragment>
    )
  }
}

export default connect(
  createStructuredSelector({
    counterValueCurrency: counterValueCurrencySelector,
  }),
  { setCounterValue },
)(CounterValueSelect)

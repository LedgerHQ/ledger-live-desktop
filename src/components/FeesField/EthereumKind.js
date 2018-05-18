// @flow

import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'

import InputCurrency from 'components/base/InputCurrency'
import type { Fees } from 'api/Fees'
import WithFeesAPI from '../WithFeesAPI'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  gasPrice: number,
  onChange: number => void,
}

class FeesField extends Component<Props & { fees?: Fees, error?: Error }, *> {
  componentDidUpdate() {
    const { gasPrice, fees, onChange } = this.props
    if (!gasPrice && fees && fees.gas_price) {
      onChange(fees.gas_price) // we want to set the default to gas_price
    }
  }
  render() {
    const { account, gasPrice, onChange, error } = this.props
    const { units } = account.currency
    return (
      <GenericContainer error={error} help="Gas">
        <InputCurrency
          defaultUnit={units[1]}
          units={units}
          containerProps={{ grow: true }}
          value={gasPrice}
          onChange={onChange}
        />
      </GenericContainer>
    )
  }
}

export default (props: Props) => (
  <WithFeesAPI
    currency={props.account.currency}
    renderError={error => <FeesField {...props} error={error} />}
    renderLoading={() => <FeesField {...props} />}
    render={fees => <FeesField {...props} fees={fees} />}
  />
)

// @flow

import React, { Component } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { apiForCurrency, parseAPIValue } from 'api/Ripple'
import InputCurrency from 'components/base/InputCurrency'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  fee: number,
  onChange: number => void,
}

type State = {
  error: ?Error,
}

class FeesField extends Component<Props, State> {
  state = {
    error: null,
  }
  componentDidMount() {
    this.sync()
  }
  async sync() {
    const api = apiForCurrency(this.props.account.currency)
    try {
      await api.connect()
      const info = await api.getServerInfo()
      const serverFee = parseAPIValue(info.validatedLedger.baseFeeXRP)
      if (!this.props.fee) {
        this.props.onChange(serverFee)
      }
    } catch (error) {
      this.setState({ error })
    } finally {
      api.disconnect()
    }
  }
  render() {
    const { account, fee, onChange } = this.props
    const { error } = this.state
    const { units } = account.currency
    return (
      <GenericContainer error={error}>
        <InputCurrency
          defaultUnit={units[0]}
          units={units}
          containerProps={{ grow: true }}
          value={fee}
          onChange={onChange}
        />
      </GenericContainer>
    )
  }
}

export default FeesField

// @flow

import React, { Component } from 'react'
import type { BigNumber } from 'bignumber.js'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { apiForEndpointConfig, parseAPIValue } from 'api/Ripple'
import InputCurrency from 'components/base/InputCurrency'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  fee: BigNumber,
  onChange: BigNumber => void,
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
  componentWillUnmount() {
    this.syncId++
  }
  syncId = 0
  async sync() {
    const api = apiForEndpointConfig(this.props.account.endpointConfig)
    const syncId = ++this.syncId
    try {
      await api.connect()
      const info = await api.getServerInfo()
      if (syncId !== this.syncId) return
      const serverFee = parseAPIValue(info.validatedLedger.baseFeeXRP)
      if (this.props.fee.isZero()) {
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

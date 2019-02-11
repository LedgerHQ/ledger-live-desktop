// @flow

import React, { Component } from 'react'
import { RippleAPI } from 'ripple-lib'
import type { BigNumber } from 'bignumber.js'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { apiForEndpointConfig, parseAPIValue } from '@ledgerhq/live-common/lib/api/Ripple'
import { FeeNotLoaded } from '@ledgerhq/errors'
import InputCurrency from 'components/base/InputCurrency'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  fee: ?BigNumber,
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
    const api = apiForEndpointConfig(RippleAPI, this.props.account.endpointConfig)
    const syncId = ++this.syncId
    try {
      await api.connect()
      const info = await api.getServerInfo()
      if (syncId !== this.syncId) return
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
      <GenericContainer>
        <InputCurrency
          defaultUnit={units[0]}
          units={units}
          containerProps={{ grow: true }}
          loading={!error && !fee}
          error={!fee && error ? new FeeNotLoaded() : null}
          value={fee}
          onChange={onChange}
        />
      </GenericContainer>
    )
  }
}

export default FeesField

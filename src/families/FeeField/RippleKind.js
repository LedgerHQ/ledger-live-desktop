// @flow

import React, { useCallback } from 'react'
import { FeeNotLoaded } from '@ledgerhq/errors'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import type { Account, Transaction, TransactionStatus } from '@ledgerhq/live-common/lib/types'
import InputCurrency from 'components/base/InputCurrency'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  onChange: Transaction => void,
}

function FeesField({ account, transaction, onChange, status }: Props) {
  const bridge = getAccountBridge(account)

  const onChangeFee = useCallback(fee => onChange(bridge.updateTransaction(transaction, { fee })), [
    transaction,
    onChange,
    bridge,
  ])

  const { units } = account.currency
  const fee = bridge.getTransactionExtra(account, transaction, 'fee')

  const error = !fee ? new FeeNotLoaded() : null
  // TODO^^^ fee error to add on status
  status

  return (
    <GenericContainer>
      <InputCurrency
        defaultUnit={units[0]}
        units={units}
        containerProps={{ grow: true }}
        loading={!error && !fee}
        error={error}
        value={fee}
        onChange={onChangeFee}
      />
    </GenericContainer>
  )
}

export default FeesField

/*
// @flow

import React, { Component } from 'react'
import type { BigNumber } from 'bignumber.js'
import { RippleAPI } from 'ripple-lib'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { apiForEndpointConfig, parseAPIValue } from '@ledgerhq/live-common/lib/api/Ripple'
import { FeeNotLoaded } from '@ledgerhq/errors'
import InputCurrency from 'components/base/InputCurrency'
import GenericContainer from './GenericContainer'

type Props = {
  account: Account,
  transaction: *,
  onChange: (*) => void,
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
      const { account, transaction, onChange } = this.props
      const bridge = getAccountBridge(account)
      const fee = bridge.getTransactionExtra(account, transaction, 'fee')
      if (!fee) {
        onChange(bridge.editTransactionExtra(account, transaction, 'fee', serverFee))
      }
    } catch (error) {
      this.setState({ error })
    } finally {
      api.disconnect()
    }
  }

  onChange = (fee: BigNumber) => {
    const { account, transaction, onChange } = this.props
    const bridge = getAccountBridge(account)
    onChange(bridge.editTransactionExtra(account, transaction, 'fee', fee))
  }

  render() {
    const { account, transaction } = this.props
    const { error } = this.state
    const { units } = account.currency
    const bridge = getAccountBridge(account)
    const fee = bridge.getTransactionExtra(account, transaction, 'fee')
    return (
      <GenericContainer>
        <InputCurrency
          defaultUnit={units[0]}
          units={units}
          containerProps={{ grow: true }}
          loading={!error && !fee}
          error={!fee && error ? new FeeNotLoaded() : null}
          value={fee}
          onChange={this.onChange}
        />
      </GenericContainer>
    )
  }
}

export default FeesField
*/

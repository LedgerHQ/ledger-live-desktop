// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import type { Account } from '@ledgerhq/live-common/lib/types'

import { getBridgeForCurrency } from 'bridge'

import Box from 'components/base/Box'
import Button from 'components/base/Button'

import type { StepProps } from '../index'

type Status = 'scanning' | 'error' | 'finished'

type State = {
  status: Status,
  err: ?Error,
  scannedAccounts: Account[],
}

const INITIAL_STATE = {
  status: 'scanning',
  err: null,
  scannedAccounts: [],
}

class StepImport extends PureComponent<StepProps, State> {
  state = INITIAL_STATE

  componentDidMount() {
    console.log(`starting import...`)
    this.startScanAccountsDevice()
  }

  componentWillUnmount() {
    console.log(`stopping import...`)
  }

  startScanAccountsDevice() {
    const { currency } = this.props

    if (!currency) {
      throw new Error('No currency to scan')
    }

    const bridge = getBridgeForCurrency(currency)

    // TODO: use the real device
    const devicePath = ''

    this.scanSubscription = bridge.scanAccountsOnDevice(currency, devicePath, {
      next: account => {
        const { scannedAccounts } = this.state
        const hasAlreadyBeenScanned = !!scannedAccounts.find(a => account.id === a.id)
        if (!hasAlreadyBeenScanned) {
          this.setState({ scannedAccounts: [...scannedAccounts, account] })
        }
      },
      complete: () => {
        this.setState({ status: 'finished' })
      },
      error: err => this.setState({ status: 'error', err }),
    })
  }

  handleRetry = () => {
    this.setState(INITIAL_STATE)
    this.startScanAccountsDevice()
  }

  render() {
    const { status, err, scannedAccounts } = this.state

    return (
      <Box>
        {status === 'scanning' && <Box>{'Scanning in progress...'}</Box>}
        {status === 'finished' && <Box>{'Finished'}</Box>}
        {['error', 'finished'].includes(status) && (
          <Button outline onClick={this.handleRetry}>
            {'retry'}
          </Button>
        )}
        {err && <Box shrink>{err.toString()}</Box>}

        <AccountsList>
          {scannedAccounts.map(account => <AccountRow key={account.id} account={account} />)}
        </AccountsList>
      </Box>
    )
  }
}

const AccountsList = styled(Box).attrs({
  flow: 2,
})``

const AccountRowContainer = styled(Box).attrs({
  horizontal: true,
})``

const AccountRow = ({ account }: { account: Account }) => (
  <AccountRowContainer>{account.name}</AccountRowContainer>
)

export default StepImport

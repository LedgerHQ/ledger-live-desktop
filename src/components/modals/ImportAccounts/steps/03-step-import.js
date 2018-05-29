// @flow

import React, { PureComponent } from 'react'
import keyBy from 'lodash/keyBy'

import type { Account } from '@ledgerhq/live-common/lib/types'

import { getBridgeForCurrency } from 'bridge'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Spinner from 'components/base/Spinner'
import IconExchange from 'icons/Exchange'

import AccountRow from '../AccountRow'

import type { StepProps } from '../index'

type Status = 'scanning' | 'error' | 'finished'

type State = {
  status: Status,
  err: ?Error,
  scannedAccounts: Account[],
  checkedAccountsIds: string[],
}

const INITIAL_STATE = {
  status: 'scanning',
  err: null,
  scannedAccounts: [],
  checkedAccountsIds: [],
}

class StepImport extends PureComponent<StepProps, State> {
  state = INITIAL_STATE

  componentDidMount() {
    console.log(`starting import...`)
    this.startScanAccountsDevice()
  }

  componentWillUnmount() {
    console.log(`stopping import...`)
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe()
    }
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
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe()
      this.scanSubscription = null
    }
    this.setState(INITIAL_STATE)
    this.startScanAccountsDevice()
  }

  handleToggleAccount = account => {
    const { checkedAccountsIds } = this.state
    const isChecked = checkedAccountsIds.find(id => id === account.id) !== undefined
    if (isChecked) {
      this.setState({ checkedAccountsIds: checkedAccountsIds.filter(id => id !== account.id) })
    } else {
      this.setState({ checkedAccountsIds: [...checkedAccountsIds, account.id] })
    }
  }

  handleAccountUpdate = updatedAccount => {
    const { scannedAccounts } = this.state
    this.setState({
      scannedAccounts: scannedAccounts.map(account => {
        if (account.id !== updatedAccount.id) {
          return account
        }
        return updatedAccount
      }),
    })
  }

  render() {
    const { status, err, scannedAccounts, checkedAccountsIds } = this.state

    return (
      <Box>
        {err && <Box shrink>{err.toString()}</Box>}

        <Box flow={2}>
          {scannedAccounts.map(account => {
            const isChecked = checkedAccountsIds.find(id => id === account.id) !== undefined
            return (
              <AccountRow
                key={account.id}
                account={account}
                isChecked={isChecked}
                onClick={this.handleToggleAccount}
                onAccountUpdate={this.handleAccountUpdate}
              />
            )
          })}
          {status === 'scanning' && (
            <Box
              horizontal
              bg="lightGrey"
              borderRadius={3}
              px={3}
              align="center"
              justify="center"
              style={{ height: 48 }}
            >
              <Spinner color="grey" size={24} />
            </Box>
          )}
        </Box>

        <Box horizontal mt={2}>
          {['error', 'finished'].includes(status) && (
            <Button small outline onClick={this.handleRetry}>
              <Box horizontal flow={2} align="center">
                <IconExchange size={13} />
                <span>{'retry'}</span>
              </Box>
            </Button>
          )}
        </Box>
      </Box>
    )
  }
}

export default StepImport

export const StepImportFooter = (props: StepProps) => {
  return (
    <div>noetuhnoethunot</div>
  )
}

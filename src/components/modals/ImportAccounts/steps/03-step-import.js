// @flow

import React, { PureComponent } from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'

import { getBridgeForCurrency } from 'bridge'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Spinner from 'components/base/Spinner'
import FakeLink from 'components/base/FakeLink'
import IconExchange from 'icons/Exchange'

import AccountRow from '../AccountRow'

import type { StepProps } from '../index'

class StepImport extends PureComponent<StepProps> {
  componentDidMount() {
    this.startScanAccountsDevice()
  }

  componentWillUnmount() {
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe()
    }
  }

  scanSubscription = null

  startScanAccountsDevice() {
    const { currency, currentDevice, setState } = this.props
    try {
      if (!currency) {
        throw new Error('No currency to scan')
      }

      if (!currentDevice) {
        throw new Error('No device')
      }

      const bridge = getBridgeForCurrency(currency)

      // TODO: use the real device
      const devicePath = currentDevice.path

      setState({ scanStatus: 'scanning' })

      this.scanSubscription = bridge.scanAccountsOnDevice(currency, devicePath, {
        next: account => {
          const { scannedAccounts } = this.props
          const hasAlreadyBeenScanned = !!scannedAccounts.find(a => account.id === a.id)
          if (!hasAlreadyBeenScanned) {
            setState({ scannedAccounts: [...scannedAccounts, account] })
          }
        },
        complete: () => setState({ scanStatus: 'finished' }),
        error: err => setState({ scanStatus: 'error', err }),
      })
    } catch (err) {
      setState({ scanStatus: 'error', err })
    }
  }

  handleRetry = () => {
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe()
      this.scanSubscription = null
    }
    this.handleResetState()
    this.startScanAccountsDevice()
  }

  handleResetState = () => {
    const { setState } = this.props
    setState({
      scanStatus: 'idle',
      err: null,
      scannedAccounts: [],
      checkedAccountsIds: [],
    })
  }

  handleToggleAccount = (account: Account) => {
    const { checkedAccountsIds, setState } = this.props
    const isChecked = checkedAccountsIds.find(id => id === account.id) !== undefined
    if (isChecked) {
      setState({ checkedAccountsIds: checkedAccountsIds.filter(id => id !== account.id) })
    } else {
      setState({ checkedAccountsIds: [...checkedAccountsIds, account.id] })
    }
  }

  handleAccountUpdate = (updatedAccount: Account) => {
    const { scannedAccounts, setState } = this.props
    setState({
      scannedAccounts: scannedAccounts.map(account => {
        if (account.id !== updatedAccount.id) {
          return account
        }
        return updatedAccount
      }),
    })
  }

  handleToggleSelectAll = () => {
    const { scannedAccounts, setState } = this.props
    setState({ checkedAccountsIds: scannedAccounts.map(a => a.id) })
  }

  render() {
    const { scanStatus, err, scannedAccounts, checkedAccountsIds, existingAccounts } = this.props

    return (
      <Box>
        {err && <Box shrink>{err.message}</Box>}

        {!!scannedAccounts.length && (
          <Box horizontal justify="flex-end" mb={2}>
            <FakeLink onClick={this.handleToggleSelectAll} fontSize={3}>
              {'Select all'}
            </FakeLink>
          </Box>
        )}

        <Box flow={2}>
          {scannedAccounts.map(account => {
            const isChecked = checkedAccountsIds.find(id => id === account.id) !== undefined
            const existingAccount = existingAccounts.find(a => a.id === account.id)
            const isDisabled = existingAccount !== undefined
            return (
              <AccountRow
                key={account.id}
                account={existingAccount || account}
                isChecked={isChecked}
                isDisabled={isDisabled}
                onClick={this.handleToggleAccount}
                onAccountUpdate={this.handleAccountUpdate}
              />
            )
          })}
          {scanStatus === 'scanning' && (
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
          {['error', 'finished'].includes(scanStatus) && (
            <Button small outline onClick={this.handleRetry}>
              <Box horizontal flow={2} align="center">
                <IconExchange size={13} />
                <span>{'retry sync'}</span>
              </Box>
            </Button>
          )}
        </Box>
      </Box>
    )
  }
}

export default StepImport

export const StepImportFooter = ({ scanStatus, onClickImport, checkedAccountsIds }: StepProps) => (
  <Button
    primary
    disabled={scanStatus !== 'finished' || checkedAccountsIds.length === 0}
    onClick={() => onClickImport()}
  >
    {'Import accounts'}
  </Button>
)

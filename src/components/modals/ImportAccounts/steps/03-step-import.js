// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { Account } from '@ledgerhq/live-common/lib/types'
import uniq from 'lodash/uniq'

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
          const { scannedAccounts, checkedAccountsIds } = this.props
          const hasAlreadyBeenScanned = !!scannedAccounts.find(a => account.id === a.id)
          if (!hasAlreadyBeenScanned) {
            setState({
              scannedAccounts: [...scannedAccounts, account],
              checkedAccountsIds:
                account.operations.length > 0
                  ? uniq([...checkedAccountsIds, account.id])
                  : checkedAccountsIds,
            })
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
    setState({
      checkedAccountsIds: scannedAccounts.filter(a => a.operations.length > 0).map(a => a.id),
    })
  }

  render() {
    const { scanStatus, err, scannedAccounts, checkedAccountsIds, existingAccounts } = this.props

    const importableAccounts = scannedAccounts.filter(acc => {
      if (acc.operations.length <= 0) {
        return false
      }
      return existingAccounts.find(a => a.id === acc.id) === undefined
    })

    const creatableAccounts = scannedAccounts.filter(acc => {
      if (acc.operations.length > 0) {
        return false
      }
      return existingAccounts.find(a => a.id === acc.id) === undefined
    })

    return (
      <Box>
        {err && <Box shrink>{err.message}</Box>}

        <Box flow={5}>
          <Box>
            {!!importableAccounts.length && (
              <Box horizontal mb={3} align="center">
                <Box
                  ff="Open Sans|Bold"
                  color="dark"
                  fontSize={2}
                  style={{ textTransform: 'uppercase' }}
                >
                  {`Account(s) to import (${importableAccounts.length})`}
                </Box>
                <FakeLink ml="auto" onClick={this.handleToggleSelectAll} fontSize={3}>
                  {'Select all'}
                </FakeLink>
              </Box>
            )}

            <Box flow={2}>
              {importableAccounts.map(account => {
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
                <LoadingRow>
                  <Spinner color="grey" size={16} />
                </LoadingRow>
              )}
            </Box>
          </Box>
          {creatableAccounts.length > 0 && (
            <Box>
              <Box horizontal mb={3} align="center">
                <Box
                  ff="Open Sans|Bold"
                  color="dark"
                  fontSize={2}
                  style={{ textTransform: 'uppercase' }}
                >
                  {'Create account'}
                </Box>
              </Box>
              <AccountRow
                account={creatableAccounts[0]}
                isChecked={
                  checkedAccountsIds.find(id => id === creatableAccounts[0].id) !== undefined
                }
                onClick={this.handleToggleAccount}
                onAccountUpdate={this.handleAccountUpdate}
              />
            </Box>
          )}
        </Box>

        <Box horizontal mt={2}>
          {['error'].includes(scanStatus) && (
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

export const LoadingRow = styled(Box).attrs({
  horizontal: true,
  borderRadius: 1,
  px: 3,
  align: 'center',
  justify: 'center',
})`
  height: 48px;
  border: 1px dashed ${p => p.theme.colors.fog};
`

export const StepImportFooter = ({ scanStatus, onClickImport, checkedAccountsIds }: StepProps) => (
  <Button
    primary
    disabled={scanStatus !== 'finished' || checkedAccountsIds.length === 0}
    onClick={() => onClickImport()}
  >
    {'Import accounts'}
  </Button>
)

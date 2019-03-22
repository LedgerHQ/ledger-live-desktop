// @flow

import logger from 'logger'
import invariant from 'invariant'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import React, { PureComponent, Fragment } from 'react'
import type { CryptoCurrency, Account } from '@ledgerhq/live-common/lib/types'
import uniq from 'lodash/uniq'
import { urls } from 'config/urls'
import ExternalLinkButton from 'components/base/ExternalLinkButton'
import RetryButton from 'components/base/RetryButton'
import { isAccountEmpty } from '@ledgerhq/live-common/lib/account'
import { DeviceShouldStayInApp } from '@ledgerhq/errors'

import { getBridgeForCurrency } from 'bridge'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import CurrencyBadge from 'components/base/CurrencyBadge'
import Button from 'components/base/Button'
import AccountsList from 'components/base/AccountsList'
import IconExclamationCircleThin from 'icons/ExclamationCircleThin'
import TranslatedError from 'components/TranslatedError'
import Spinner from 'components/base/Spinner'
import Text from 'components/base/Text'
import DebugAppInfosForCurrency from 'components/DebugAppInfosForCurrency'

import type { StepProps } from '../index'

// $FlowFixMe
const remapTransportError = (err: mixed, appName: string): Error => {
  if (!err || typeof err !== 'object') return err

  const { name, statusCode } = err

  const errorToThrow =
    name === 'BtcUnmatchedApp' || statusCode === 0x6982 || statusCode === 0x6700
      ? new DeviceShouldStayInApp(null, { appName })
      : err

  return errorToThrow
}

const ImportError = ({ error, currency }: { error: Error, currency: ?CryptoCurrency }) => (
  <Box style={{ height: 200 }} px={5} justify="center">
    <Box color="alertRed" align="center">
      <IconExclamationCircleThin size={43} />
    </Box>
    {currency ? <DebugAppInfosForCurrency currencyId={currency.id} /> : null}
    <Title>
      <TranslatedError error={error} field="title" />
    </Title>
    <Desc>
      <TranslatedError error={error} field="description" />
    </Desc>
  </Box>
)

const LoadingRow = styled(Box).attrs({
  horizontal: true,
  borderRadius: 1,
  px: 3,
  align: 'center',
  justify: 'center',
  mt: 1,
})`
  height: 48px;
  border: 1px dashed ${p => p.theme.colors.grey};
`
const Title = styled(Box).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  mt: 2,
  color: 'black',
})`
  text-align: center;
`

const Desc = styled(Box).attrs({
  ff: 'Open Sans',
  fontSize: 4,
  mt: 2,
  color: 'graphite',
})`
  text-align: center;
`

class StepImport extends PureComponent<StepProps> {
  componentDidMount() {
    this.props.setScanStatus('scanning')
  }

  componentDidUpdate(prevProps: StepProps) {
    const didStartScan = prevProps.scanStatus !== 'scanning' && this.props.scanStatus === 'scanning'
    const didFinishScan =
      prevProps.scanStatus !== 'finished' && this.props.scanStatus === 'finished'

    // handle case when we click on retry sync
    if (didStartScan) {
      this.startScanAccountsDevice()
    }

    // handle case when we click on stop sync
    if (didFinishScan) {
      this.unsub()
    }
  }

  componentWillUnmount() {
    this.unsub()
  }

  scanSubscription = null

  unsub = () => {
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe()
    }
  }

  translateName(account: Account) {
    const { t } = this.props
    let { name } = account

    const isLegacy = name.indexOf('legacy') !== -1
    const isUnsplit = name.indexOf('unsplit') !== -1

    if (name === 'New Account') {
      name = t('addAccounts.newAccount')
    } else if (isLegacy) {
      if (isUnsplit) {
        name = t('addAccounts.legacyUnsplitAccount', {
          accountName: name.replace(' (legacy)', '').replace(' (unsplit)', ''),
        })
      } else {
        name = t('addAccounts.legacyAccount', { accountName: name.replace(' (legacy)', '') })
      }
    } else if (isUnsplit) {
      name = t('addAccounts.unsplitAccount', { accountName: name.replace(' (unsplit)', '') })
    }

    return {
      ...account,
      name,
    }
  }

  startScanAccountsDevice() {
    this.unsub()
    const { currency, device, setScanStatus, setScannedAccounts } = this.props
    try {
      invariant(currency, 'No currency to scan')
      invariant(device, 'No device')

      const bridge = getBridgeForCurrency(currency)

      // TODO: use the real device
      const devicePath = device.path

      this.scanSubscription = bridge.scanAccountsOnDevice(currency, devicePath).subscribe({
        next: account => {
          const { scannedAccounts, checkedAccountsIds, existingAccounts } = this.props
          const hasAlreadyBeenScanned = !!scannedAccounts.find(a => account.id === a.id)
          const hasAlreadyBeenImported = !!existingAccounts.find(a => account.id === a.id)
          const isNewAccount = isAccountEmpty(account)
          if (!hasAlreadyBeenScanned) {
            setScannedAccounts({
              scannedAccounts: [...scannedAccounts, this.translateName(account)],
              checkedAccountsIds:
                !hasAlreadyBeenImported && !isNewAccount
                  ? uniq([...checkedAccountsIds, account.id])
                  : checkedAccountsIds,
            })
          }
        },
        complete: () => {
          setScanStatus('finished')
        },
        error: err => {
          logger.critical(err)
          const error = remapTransportError(err, currency.name)
          setScanStatus('error', error)
        },
      })
    } catch (err) {
      setScanStatus('error', err)
    }
  }

  handleRetry = () => {
    this.unsub()
    this.props.resetScanState()
    this.startScanAccountsDevice()
  }

  handleToggleAccount = (account: Account) => {
    const { checkedAccountsIds, setScannedAccounts } = this.props
    const isChecked = checkedAccountsIds.find(id => id === account.id) !== undefined
    if (isChecked) {
      setScannedAccounts({ checkedAccountsIds: checkedAccountsIds.filter(id => id !== account.id) })
    } else {
      setScannedAccounts({ checkedAccountsIds: [...checkedAccountsIds, account.id] })
    }
  }

  handleSelectAll = (accountsToSelect: Account[]) => {
    const { setScannedAccounts, checkedAccountsIds } = this.props
    setScannedAccounts({
      checkedAccountsIds: uniq(checkedAccountsIds.concat(accountsToSelect.map(a => a.id))),
    })
  }

  handleUnselectAll = (accountsToRemove: Account[]) => {
    const { setScannedAccounts, checkedAccountsIds } = this.props
    setScannedAccounts({
      checkedAccountsIds: checkedAccountsIds.filter(id => !accountsToRemove.some(a => id === a.id)),
    })
  }

  render() {
    const {
      scanStatus,
      currency,
      err,
      scannedAccounts,
      checkedAccountsIds,
      existingAccounts,
      setAccountName,
      editedNames,
      t,
    } = this.props

    if (err) {
      return <ImportError error={err} currency={currency} />
    }

    const currencyName = currency ? currency.name : ''

    const importedAccounts = []
    const importableAccounts = []
    const creatableAccounts = []
    let alreadyEmptyAccount
    scannedAccounts.forEach(acc => {
      const existingAccount = existingAccounts.find(a => a.id === acc.id)
      const empty = isAccountEmpty(acc)
      if (existingAccount) {
        importedAccounts.push(existingAccount)
        if (empty) {
          alreadyEmptyAccount = existingAccount
        }
      } else if (empty) {
        creatableAccounts.push(acc)
      } else {
        importableAccounts.push(acc)
      }
    })

    const importableAccountsListTitle = t('addAccounts.accountToImportSubtitle', {
      count: importableAccounts.length,
    })

    const importedAccountsListTitle = t('addAccounts.accountAlreadyImportedSubtitle', {
      count: importedAccounts.length,
    })

    const importableAccountsEmpty = t('addAccounts.noAccountToImport', { currencyName })

    const shouldShowNew = scanStatus !== 'scanning'

    return (
      <Fragment>
        <TrackPage category="AddAccounts" name="Step3" />
        <Box mt={-4}>
          {importableAccounts.length === 0 ? null : (
            <AccountsList
              title={importableAccountsListTitle}
              emptyText={importableAccountsEmpty}
              accounts={importableAccounts}
              checkedIds={checkedAccountsIds}
              onToggleAccount={this.handleToggleAccount}
              setAccountName={setAccountName}
              editedNames={editedNames}
              onSelectAll={this.handleSelectAll}
              onUnselectAll={this.handleUnselectAll}
              autoFocusFirstInput
            />
          )}
          {!shouldShowNew ? null : (
            <AccountsList
              autoFocusFirstInput={importableAccounts.length === 0}
              title={t('addAccounts.createNewAccount.title')}
              emptyText={
                alreadyEmptyAccount ? (
                  <Trans
                    i18nKey="addAccounts.createNewAccount.noOperationOnLastAccount"
                    parent="div"
                  >
                    {' '}
                    <Text ff="Open Sans|SemiBold" color="dark">
                      {alreadyEmptyAccount.name}
                    </Text>{' '}
                  </Trans>
                ) : (
                  <Trans i18nKey="addAccounts.createNewAccount.noAccountToCreate" parent="div">
                    {' '}
                    <Text ff="Open Sans|SemiBold" color="dark">
                      {currencyName}
                    </Text>{' '}
                  </Trans>
                )
              }
              accounts={creatableAccounts}
              checkedIds={checkedAccountsIds}
              onToggleAccount={this.handleToggleAccount}
              setAccountName={setAccountName}
              editedNames={editedNames}
              hideAmount
            />
          )}
          {importedAccounts.length === 0 ? null : (
            <AccountsList
              title={importedAccountsListTitle}
              accounts={importedAccounts}
              editedNames={editedNames}
              collapsible
            />
          )}
          {scanStatus === 'scanning' ? (
            <LoadingRow>
              <Spinner color="grey" size={16} />
              <Box ml={2} ff="Open Sans|Regular" color="grey" fontSize={4}>
                {t('common.sync.syncing')}
              </Box>
            </LoadingRow>
          ) : null}
        </Box>

        {err && <Box shrink>{err.message}</Box>}
      </Fragment>
    )
  }
}

export default StepImport

export const StepImportFooter = ({
  transitionTo,
  setScanStatus,
  scanStatus,
  onClickAdd,
  onCloseModal,
  checkedAccountsIds,
  scannedAccounts,
  currency,
  t,
}: StepProps) => {
  const willCreateAccount = checkedAccountsIds.some(id => {
    const account = scannedAccounts.find(a => a.id === id)
    return account && isAccountEmpty(account)
  })

  const willAddAccounts = checkedAccountsIds.some(id => {
    const account = scannedAccounts.find(a => a.id === id)
    return account && !isAccountEmpty(account)
  })

  const count = checkedAccountsIds.length

  const ctaWording =
    scanStatus === 'scanning' ? t('common.sync.syncing') : t('addAccounts.cta.add', { count })

  const willClose = !willCreateAccount && !willAddAccounts
  const onClick = willClose
    ? onCloseModal
    : async () => {
        await onClickAdd()
        transitionTo('finish')
      }

  return (
    <Fragment>
      {currency && <CurrencyBadge mr="auto" currency={currency} />}
      {scanStatus === 'error' && (
        <Fragment>
          <ExternalLinkButton mr={2} label={t('common.getSupport')} url={urls.faq} />
          <RetryButton primary onClick={() => setScanStatus('scanning')} />
        </Fragment>
      )}
      {scanStatus === 'scanning' && (
        <Button mr={2} onClick={() => setScanStatus('finished')}>
          {t('common.stop')}
        </Button>
      )}
      {scanStatus !== 'error' && (
        <Button
          primary
          disabled={scanStatus !== 'finished' || !(willCreateAccount || willAddAccounts)}
          onClick={onClick}
        >
          {ctaWording}
        </Button>
      )}
    </Fragment>
  )
}

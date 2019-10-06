// @flow

import logger from 'logger'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import React, { PureComponent, Fragment, useEffect } from 'react'
import { filter, map } from 'rxjs/operators'
import type { Account } from '@ledgerhq/live-common/lib/types'
import uniq from 'lodash/uniq'
import { urls } from 'config/urls'
import ExternalLinkButton from 'components/base/ExternalLinkButton'
import RetryButton from 'components/base/RetryButton'
import { isAccountEmpty, groupAddAccounts } from '@ledgerhq/live-common/lib/account'
import { DeviceShouldStayInApp } from '@ledgerhq/errors'
import { getCurrencyBridge } from '@ledgerhq/live-common/lib/bridge'
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

const ImportError = ({ error }: { error: Error }) => (
  <Box style={{ height: 200 }} px={5} justify="center">
    <Box color="alertRed" align="center">
      <IconExclamationCircleThin size={43} />
    </Box>
    <DebugAppInfosForCurrency />
    <Title>
      <TranslatedError error={error} field="title" />
    </Title>
    <Desc>
      <TranslatedError error={error} field="description" />
    </Desc>
  </Box>
)

const LoadingRow = styled(Box).attrs(() => ({
  horizontal: true,
  borderRadius: 1,
  px: 3,
  align: 'center',
  justify: 'center',
  mt: 1,
}))`
  height: 48px;
  border: 1px dashed ${p => p.theme.colors.palette.text.shade60};
`
const Title = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 5,
  mt: 2,
  color: 'palette.text.shade100',
}))`
  text-align: center;
`

const Desc = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 4,
  mt: 2,
  color: 'palette.text.shade80',
}))`
  text-align: center;
`

const SectionAccounts = ({ defaultSelected, ...rest }: *) => {
  // componentDidMount-like effect
  useEffect(() => {
    if (defaultSelected && rest.onSelectAll) {
      rest.onSelectAll(rest.accounts)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <AccountsList {...rest} />
}

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

  startScanAccountsDevice() {
    this.unsub()
    const { currency, device, setScanStatus, setScannedAccounts } = this.props
    if (!currency || !device) return
    const mainCurrency = currency.type === 'TokenCurrency' ? currency.parentCurrency : currency
    try {
      const bridge = getCurrencyBridge(mainCurrency)

      // TODO: use the real device
      const devicePath = device.path

      // will be set to false if an existing account is found
      let onlyNewAccounts = true

      this.scanSubscription = bridge
        .scanAccountsOnDevice(mainCurrency, devicePath)
        .pipe(
          filter(e => e.type === 'discovered'),
          map(e => e.account),
        )
        .subscribe({
          next: account => {
            const { scannedAccounts, checkedAccountsIds, existingAccounts } = this.props
            const hasAlreadyBeenScanned = !!scannedAccounts.find(a => account.id === a.id)
            const hasAlreadyBeenImported = !!existingAccounts.find(a => account.id === a.id)
            const isNewAccount = isAccountEmpty(account)
            if (!isNewAccount && !hasAlreadyBeenImported) {
              onlyNewAccounts = false
            }
            if (!hasAlreadyBeenScanned) {
              setScannedAccounts({
                scannedAccounts: [...scannedAccounts, account],
                checkedAccountsIds: onlyNewAccounts
                  ? [account.id]
                  : !hasAlreadyBeenImported && !isNewAccount
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
    if (!currency) return null
    const mainCurrency = currency.type === 'TokenCurrency' ? currency.parentCurrency : currency

    if (err) {
      return <ImportError error={err} currency={mainCurrency} />
    }

    const currencyName = mainCurrency ? mainCurrency.name : ''

    const { sections, alreadyEmptyAccount } = groupAddAccounts(existingAccounts, scannedAccounts, {
      scanning: scanStatus === 'scanning',
    })

    const emptyTexts = {
      importable: t('addAccounts.noAccountToImport', { currencyName }),

      creatable: alreadyEmptyAccount ? (
        <Trans i18nKey="addAccounts.createNewAccount.noOperationOnLastAccount" parent="div">
          {' '}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            {alreadyEmptyAccount.name}
          </Text>{' '}
        </Trans>
      ) : (
        <Trans i18nKey="addAccounts.createNewAccount.noAccountToCreate" parent="div">
          {' '}
          <Text ff="Inter|SemiBold" color="palette.text.shade100">
            {currencyName}
          </Text>{' '}
        </Trans>
      ),
    }

    return (
      <Fragment>
        <TrackPage category="AddAccounts" name="Step3" />
        <Box mt={-4}>
          {sections.map(({ id, selectable, defaultSelected, data }, i) => (
            <SectionAccounts
              currency={currency}
              defaultSelected={defaultSelected}
              key={id}
              title={t(`addAccounts.sections.${id}.title`, { count: data.length })}
              emptyText={emptyTexts[id]}
              accounts={data}
              autoFocusFirstInput={selectable && i === 0}
              hideAmount={id === 'creatable'}
              checkedIds={!selectable ? undefined : checkedAccountsIds}
              onToggleAccount={!selectable ? undefined : this.handleToggleAccount}
              setAccountName={!selectable ? undefined : setAccountName}
              editedNames={!selectable ? undefined : editedNames}
              onSelectAll={!selectable ? undefined : this.handleSelectAll}
              onUnselectAll={!selectable ? undefined : this.handleUnselectAll}
            />
          ))}

          {scanStatus === 'scanning' ? (
            <LoadingRow>
              <Spinner color="palette.text.shade60" size={16} />
              <Box ml={2} ff="Inter|Regular" color="palette.text.shade60" fontSize={4}>
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
  const willClose = !willCreateAccount && !willAddAccounts

  const ctaWording =
    scanStatus === 'scanning'
      ? t('common.sync.syncing')
      : willClose
      ? t('common.close')
      : t('addAccounts.cta.add', { count })

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
        <Button primary disabled={scanStatus !== 'finished'} onClick={onClick}>
          {ctaWording}
        </Button>
      )}
    </Fragment>
  )
}

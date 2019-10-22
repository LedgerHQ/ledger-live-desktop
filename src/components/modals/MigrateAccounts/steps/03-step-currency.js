// @flow

import invariant from 'invariant'
import React, { Fragment, PureComponent } from 'react'
import logger from 'logger'
import { reduce, filter, map } from 'rxjs/operators'
import { Trans } from 'react-i18next'

import type { Account } from '@ledgerhq/live-common/lib/types/account'
import { findAccountMigration, migrateAccounts } from '@ledgerhq/live-common/lib/account'
import last from 'lodash/last'
import Text from 'components/base/Text'
import TrackPage from 'analytics/TrackPage'
import IconExclamationCircle from 'icons/ExclamationCircle'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import { CurrencyCircleIcon } from 'components/base/CurrencyBadge'
import { getCurrencyBridge } from '@ledgerhq/live-common/lib/bridge'
import styled from 'styled-components'
import IconExclamationCircleThin from 'icons/ExclamationCircleThin'
import TranslatedError from 'components/TranslatedError'
import DebugAppInfosForCurrency from 'components/DebugAppInfosForCurrency'
import { colors } from 'styles/theme'
import type { StepProps } from '../index'
import ExternalLinkButton from '../../../base/ExternalLinkButton'
import RetryButton from '../../../base/RetryButton'
import { urls } from '../../../../config/urls'

type Props = StepProps & { replaceAccounts: (Account[]) => void }

const MigrationError = ({ error }: { error: Error }) => (
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

const Exclamation = styled.div`
  align-self: center;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  margin-bottom: 20px;
  background-color: ${p => p.theme.colors.pillActiveBackground};
  align-items: center;
  display: flex;
  justify-content: center;
`

class StepCurrency extends PureComponent<Props> {
  componentDidMount() {
    this.props.setScanStatus('scanning')
    this.startScanAccountsDevice()
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
    const {
      currency,
      device,
      setScanStatus,
      accounts,
      replaceAccounts,
      starredAccountIds,
      replaceStarAccountId,
      addMigratedAccount,
    } = this.props

    if (!currency || !device) return

    this.scanSubscription = getCurrencyBridge(currency)
      .scanAccountsOnDevice(currency, device.path)
      .pipe(
        filter(e => e.type === 'discovered'),
        map(e => e.account),
        reduce<Account>((all, acc) => all.concat(acc), []),
      )
      .subscribe({
        next: scannedAccounts => {
          let totalMigratedAccounts = 0
          accounts.forEach(a => {
            const maybeMigration = findAccountMigration(a, scannedAccounts)
            if (maybeMigration) {
              totalMigratedAccounts++
              if (starredAccountIds.includes(a.id)) {
                replaceStarAccountId({ oldId: a.id, newId: maybeMigration.id })
              }
            }
          })

          const migratedAccounts = migrateAccounts({ scannedAccounts, existingAccounts: accounts })
          replaceAccounts(migratedAccounts)
          migratedAccounts.forEach((account: Account) => {
            addMigratedAccount(currency, account)
          })
          setScanStatus(totalMigratedAccounts ? 'finished' : 'finished-empty')
        },
        error: err => {
          logger.critical(err)
          setScanStatus('error', err)
        },
      })
  }

  render() {
    const { currency, scanStatus, err } = this.props
    invariant(currency, 'No crypto asset given')

    const currencyName = `${currency.name} (${currency.ticker})`
    const pending = !['finished', 'finished-empty'].includes(scanStatus)

    if (err) {
      return <MigrationError error={err} />
    }

    return (
      <Fragment>
        <TrackPage category="MigrateAccounts" name="Step3" />
        <Box align="center" pt={pending ? 30 : 0} pb={pending ? 40 : 0}>
          {scanStatus === 'finished-empty' ? (
            <Exclamation>
              <IconExclamationCircle size={20} color={colors.wallet} />
            </Exclamation>
          ) : (
            <CurrencyCircleIcon
              showSpinner={pending}
              showCheckmark={!pending}
              borderRadius="10px"
              mb={15}
              size={40}
              currency={currency}
            />
          )}
          <Box
            ff="Inter|Regular"
            fontSize={6}
            color="palette.text.shade100"
            mb={10}
            textAlign="center"
            style={{ width: 370 }}
          >
            <Trans
              i18nKey={`migrateAccounts.progress.${scanStatus}.title`}
              parent="div"
              values={{ currencyName }}
            />
          </Box>
          <Text color="palette.text.shade80" ff="Inter|Regular" fontSize={4}>
            <Trans
              i18nKey={`migrateAccounts.progress.${scanStatus}.description`}
              values={{ currencyName }}
            />
          </Text>
        </Box>
      </Fragment>
    )
  }
}

export const StepCurrencyFooter = ({
  transitionTo,
  scanStatus,
  currencyIds,
  moveToNextCurrency,
  getNextCurrency,
  currency,
  migratableAccounts,
}: StepProps) => {
  if (scanStatus === 'error') {
    return (
      <Fragment>
        <ExternalLinkButton mr={2} label={<Trans i18nKey="common.getSupport" />} url={urls.faq} />
        <RetryButton primary onClick={() => transitionTo('device')} />
      </Fragment>
    )
  }
  if (!['finished', 'finished-empty'].includes(scanStatus) || !currency) return null
  const lastCurrency = last(currencyIds)
  const next = lastCurrency !== currency.id && currency.id < lastCurrency ? 'device' : 'overview'
  const nextCurrency = getNextCurrency()
  return (
    <Button
      primary
      onClick={() => {
        if (!migratableAccounts.length) {
          transitionTo('overview')
        } else {
          moveToNextCurrency(next === 'overview')
          transitionTo(next)
        }
      }}
    >
      <Trans
        i18nKey={next === 'device' ? 'migrateAccounts.cta.nextCurrency' : 'common.continue'}
        values={{ currency: nextCurrency ? nextCurrency.name : '' }}
      />
    </Button>
  )
}

export default StepCurrency

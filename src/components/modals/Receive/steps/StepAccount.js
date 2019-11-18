// @flow

import React, { useCallback, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { getMainAccount, getReceiveFlowError } from '@ledgerhq/live-common/lib/account'
import { listTokensForCryptoCurrency } from '@ledgerhq/live-common/lib/currencies'
import type { CryptoCurrency, TokenCurrency } from '@ledgerhq/live-common/lib/types/currencies'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import Button from 'components/base/Button'
import SelectAccount from 'components/SelectAccount'
import SelectCurrency from 'components/SelectCurrency'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import ErrorBanner from 'components/ErrorBanner'
import type { StepProps } from '..'

const AccountSelection = ({ onChangeAccount, account }) => (
  <>
    <Label>
      <Trans i18nKey="receive.steps.chooseAccount.label" />
    </Label>
    <SelectAccount autoFocus withSubAccounts onChange={onChangeAccount} value={account} />
  </>
)

const TokenParentSelection = ({ onChangeAccount, mainAccount }) => {
  const filterAccountSelect = useCallback(account => account.currency === mainAccount.currency, [
    mainAccount,
  ])
  return (
    <>
      <Label>
        <Trans
          i18nKey="receive.steps.chooseAccount.parentAccount"
          values={{
            currencyName: mainAccount.currency.name,
          }}
        />
      </Label>
      <SelectAccount filter={filterAccountSelect} onChange={onChangeAccount} value={mainAccount} />
    </>
  )
}

const TokenSelection = ({
  currency,
  token,
  onChangeToken,
}: {
  currency: CryptoCurrency,
  token: ?TokenCurrency,
  onChangeToken: (?TokenCurrency) => void,
}) => {
  const tokens = useMemo(() => listTokensForCryptoCurrency(currency), [currency])
  return (
    <>
      <Label mt={30}>
        <Trans i18nKey="receive.steps.chooseAccount.token" />
      </Label>
      <SelectCurrency onChange={onChangeToken} currencies={tokens} value={token} />
    </>
  )
}

export default function StepAccount({
  token,
  account,
  parentAccount,
  receiveTokenMode,
  onChangeAccount,
  onChangeToken,
}: StepProps) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null
  const error = account ? getReceiveFlowError(account, parentAccount) : null

  return (
    <Box flow={1}>
      <TrackPage category="Receive Flow" name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      {receiveTokenMode && mainAccount ? (
        <TokenParentSelection mainAccount={mainAccount} onChangeAccount={onChangeAccount} />
      ) : (
        <AccountSelection account={account} onChangeAccount={onChangeAccount} />
      )}
      {receiveTokenMode && mainAccount ? (
        <TokenSelection
          currency={mainAccount.currency}
          token={token}
          onChangeToken={onChangeToken}
        />
      ) : null}
    </Box>
  )
}

export function StepAccountFooter({
  transitionTo,
  receiveTokenMode,
  token,
  account,
  parentAccount,
}: StepProps) {
  const error = account ? getReceiveFlowError(account, parentAccount) : null
  return (
    <Button
      disabled={!account || (receiveTokenMode && !token) || !!error}
      primary
      onClick={() => transitionTo('device')}
    >
      <Trans i18nKey="common.continue" />
    </Button>
  )
}

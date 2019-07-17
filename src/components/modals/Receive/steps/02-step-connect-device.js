// @flow

import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'
import { getMainAccount } from '@ledgerhq/live-common/lib/account/helpers'
import type { TokenCurrency } from '@ledgerhq/live-common/lib/types'
import { colors } from 'styles/theme'
import InfoCircle from 'icons/InfoCircle'
import Text from 'components/base/Text'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import EnsureDeviceApp from 'components/EnsureDeviceApp'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import TrackPage from 'analytics/TrackPage'

import type { StepProps } from '../index'

export const TokenTips: React$ComponentType<{ token: TokenCurrency }> = React.memo(({ token }) => (
  <Box mt={4} horizontal alignItems="center">
    <InfoCircle size={12} color={colors.graphite} />
    <Text style={{ flex: 1, marginLeft: 10 }} ff="Open Sans|Regular" color="graphite" fontSize={3}>
      <Trans i18nKey="to.do">
        {'*'}
        <Text color="dark" ff="Open Sans|SemiBold">
          {token.name}
        </Text>
        {' is a token on '}
        <Text color="dark" ff="Open Sans|SemiBold">
          {token.parentCurrency.name}
        </Text>
      </Trans>
    </Text>
  </Box>
))

export default function StepConnectDevice({
  account,
  parentAccount,
  token,
  onChangeAppOpened,
}: StepProps) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null
  const tokenCur = (account && account.type === 'TokenAccount' && account.token) || token
  return (
    <Fragment>
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      <EnsureDeviceApp
        account={mainAccount}
        isToken={!!tokenCur}
        waitBeforeSuccess={200}
        onSuccess={() => onChangeAppOpened(true)}
      />
      {!tokenCur ? null : <TokenTips token={tokenCur} />}
    </Fragment>
  )
}

export function StepConnectDeviceFooter({
  t,
  transitionTo,
  isAppOpened,
  onSkipConfirm,
}: StepProps) {
  return (
    <Box horizontal flow={2}>
      <TrackPage category="Receive Flow" name="Step 2" />
      <Button
        event="Receive Flow Without Device Clicked"
        onClick={() => {
          onSkipConfirm()
          transitionTo('receive')
        }}
      >
        {t('receive.steps.connectDevice.withoutDevice')}
      </Button>
      <Button disabled={!isAppOpened} primary onClick={() => transitionTo('confirm')}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  )
}

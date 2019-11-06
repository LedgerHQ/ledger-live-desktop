// @flow

import React from 'react'
import { Trans } from 'react-i18next'
import Button from 'components/base/Button'
import EnsureDeviceApp from 'components/EnsureDeviceApp'
import { getMainAccount } from '@ledgerhq/live-common/lib/account/helpers'

import { DEVICE_READY, NEXT, SKIP } from '../receiveFlow'
import CurrencyDownStatusAlert from '../../../CurrencyDownStatusAlert'
import Box from '../../../base/Box'

type Props = {
  send: string => void,
  context: any,
}

const PrepareDeviceStep = ({ send, context: { account, parentAccount } }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount)
  const tokenCur = account && account.type === 'TokenAccount' && account.token

  return (
    <>
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      <EnsureDeviceApp
        account={mainAccount}
        isToken={!!tokenCur}
        waitBeforeSuccess={200}
        onSuccess={() => send(DEVICE_READY)}
      />
    </>
  )
}

PrepareDeviceStep.Footer = ({ send, context: { deviceReady } }: Props) => (
  <Box horizontal flow={2}>
    <Button event="Receive Flow Without Device Clicked" onClick={() => send(SKIP)}>
      <Trans i18nKey="receive.steps.connectDevice.withoutDevice" />
    </Button>
    <Button disabled={!deviceReady} primary onClick={() => send(NEXT)}>
      <Trans i18nKey="common.continue" />
    </Button>
  </Box>
)

export default PrepareDeviceStep

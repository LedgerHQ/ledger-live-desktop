// @flow

import React, { useState } from 'react'
import { ModalBody } from 'components/base/Modal'
import { Trans } from 'react-i18next'
import Button from 'components/base/Button'
import EnsureDeviceApp from 'components/EnsureDeviceApp'

import { DEVICE_READY } from '../receiveFlow'

type Props = {
  send: string => void,
  context: any
}

const PrepareDeviceStep = ({ send, context }: Props) => {
  const [ deviceReady, setDeviceReady ] = useState(false)

  const {
    account
  } = context

  const mainAccount = account
  const tokenCur = (account && account.type === 'TokenAccount' && account.token)

  return (
    <ModalBody
      render={() => (
        <>
          <EnsureDeviceApp
            account={mainAccount}
            isToken={!!tokenCur}
            waitBeforeSuccess={200}
            onSuccess={() => setDeviceReady(true)}
          />
        </>
      )}
      renderFooter={() => (
        <Button
          disabled={!deviceReady}
          primary
          onClick={() => send(DEVICE_READY)}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      )}
    />
  )
}

export default PrepareDeviceStep
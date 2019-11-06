// @flow

import React, { useEffect } from 'react'
import { getAccountName, getMainAccount } from '@ledgerhq/live-common/lib/account/helpers'
import { useSelector } from 'react-redux'
import { WrongDeviceForAccount } from '@ledgerhq/errors'

import { DEVICE_DECLINED, DEVICE_VERIFIED, AGAIN } from '../receiveFlow'

import Box from '../../../base/Box'
import TrackPage from '../../../../analytics/TrackPage'
import CurrentAddress from '../../../CurrentAddress'
import getAddress from '../../../../commands/getAddress'
import { getCurrentDevice } from '../../../../reducers/devices'

type Props = {
  send: string => void,
  context: any,
}

const VerifyDeviceStep = ({ send, context: { account, parentAccount, deviceVerified } }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount)

  const device = useSelector(getCurrentDevice)

  useEffect(() => {
    if (deviceVerified === null) {
      getAddress
        .send({
          derivationMode: mainAccount.derivationMode,
          currencyId: mainAccount.currency.id,
          devicePath: device.path,
          path: mainAccount.freshAddressPath,
          verify: true,
        })
        .toPromise()
        .then(({ address }) => {
          if (address !== mainAccount.freshAddress) {
            throw new WrongDeviceForAccount(`WrongDeviceForAccount ${account.name}`, {
              accountName: mainAccount.name,
            })
          }
          send(DEVICE_VERIFIED)
        })
        .catch(error => {
          send({ type: DEVICE_DECLINED, error })
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box flow={5}>
      <TrackPage category="Receive Flow" name="Step 4" />
      <CurrentAddress
        name={getAccountName(account)}
        currency={mainAccount.currency}
        address={mainAccount.freshAddress}
        isAddressVerified={deviceVerified}
        onVerify={() => send(AGAIN)}
        withBadge
        withFooter
        withQRCode
      />
    </Box>
  )
}

export default VerifyDeviceStep

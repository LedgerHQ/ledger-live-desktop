// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import Btc from '@ledgerhq/hw-app-btc'

import type Transport from '@ledgerhq/hw-transport'

import type { IPCSend } from 'types/electron'

import { getPath } from 'internals/accounts/helpers'

export default async (
  send: IPCSend,
  {
    currencyId,
    devicePath,
    accountPath,
    accountAddress,
    segwit = true,
  }: {
    currencyId?: string,
    devicePath: string,
    accountPath: string,
    accountAddress: string,
    segwit: boolean,
  },
) => {
  try {
    const transport: Transport<*> = await CommNodeHid.open(devicePath)
    const btc = new Btc(transport)
    if (accountPath) {
      const { bitcoinAddress } = await btc.getWalletPublicKey(accountPath, false, segwit)
      if (bitcoinAddress === accountAddress) {
        send('devices.checkIfAppOpened.success', { devicePath })
      } else {
        throw new Error('Address is different')
      }
    }
    if (currencyId) {
      await btc.getWalletPublicKey(getPath({ currencyId, segwit }), false, segwit)
      send('devices.checkIfAppOpened.success', { devicePath })
    }
  } catch (err) {
    send('devices.checkIfAppOpened.fail', { devicePath })
  }
}

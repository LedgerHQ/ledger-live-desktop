// @flow

import invariant from 'invariant'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import type Transport from '@ledgerhq/hw-transport'
import type { IPCSend } from 'types/electron'
import getAddressForCurrency from './getAddressForCurrency'

export default async (
  send: IPCSend,
  {
    currencyId,
    devicePath,
    accountPath,
    accountAddress,
    ...options
  }: {
    currencyId: string,
    devicePath: string,
    accountPath: ?string,
    accountAddress: ?string,
  },
) => {
  try {
    invariant(currencyId, 'currencyId "%s" not defined', currencyId)
    const transport: Transport<*> = await CommNodeHid.open(devicePath)
    const resolver = getAddressForCurrency(currencyId)
    const address = await resolver(transport, currencyId, accountPath, options)
    if (accountPath && accountAddress && address !== accountAddress) {
      throw new Error('Account address is different than device address')
    }
    send('devices.ensureDeviceApp.success', { devicePath })
  } catch (err) {
    send('devices.ensureDeviceApp.fail', { devicePath })
  }
}

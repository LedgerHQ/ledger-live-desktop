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
    path,
    ...options
  }: {
    currencyId: string,
    devicePath: string,
    path: string,
    verify?: boolean,
  },
) => {
  try {
    invariant(currencyId, 'currencyId "%s" not defined', currencyId)
    const transport: Transport<*> = await CommNodeHid.open(devicePath)
    const resolver = getAddressForCurrency(currencyId)
    const res = await resolver(transport, currencyId, path, options)
    send('devices.getAddress.success', res)
  } catch (err) {
    send('devices.getAddress.fail', { message: err.message })
  }
}

// @flow

import invariant from 'invariant'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import type Transport from '@ledgerhq/hw-transport'
import type { IPCSend } from 'types/electron'
import signTransactionForCurrency from './signTransactionForCurrency'

export default async (
  send: IPCSend,
  {
    currencyId,
    devicePath,
    path,
    transaction,
  }: {
    currencyId: string,
    devicePath: string,
    path: string,
    transaction: *,
  },
) => {
  try {
    invariant(currencyId, 'currencyId "%s" not defined', currencyId)
    const transport: Transport<*> = await CommNodeHid.open(devicePath)
    const signer = signTransactionForCurrency(currencyId)
    const res = await signer(transport, currencyId, path, transaction)
    send('devices.signTransaction.success', res)
  } catch (err) {
    send('devices.signTransaction.fail')
  }
}

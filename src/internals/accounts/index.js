// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

import type { IPCSend } from 'types/electron'

import scanAccountsOnDevice from './scanAccountsOnDevice'
import { verifyAddress, getFreshReceiveAddress } from './helpers'

import sync from './sync'

export default {
  sync,
  scan: async (
    send: IPCSend,
    {
      devicePath,
      currencyId,
    }: {
      devicePath: string,
      currencyId: string,
    },
  ) => {
    try {
      send('accounts.scanAccountsOnDevice.start', { pid: process.pid }, { kill: false })
      const accounts = await scanAccountsOnDevice({
        devicePath,
        currencyId,
        onAccountScanned: account => {
          send('accounts.scanAccountsOnDevice.accountScanned', account, { kill: false })
        },
      })
      send('accounts.scanAccountsOnDevice.success', accounts)
    } catch (err) {
      send('accounts.scanAccountsOnDevice.fail', err)
    }
  },

  getFreshReceiveAddress: async (
    send: IPCSend,
    {
      currencyId,
      accountIndex,
    }: {
      currencyId: string,
      accountIndex: number,
    },
  ) => {
    try {
      const freshAddress = await getFreshReceiveAddress({ currencyId, accountIndex })
      send('accounts.getFreshReceiveAddress.success', freshAddress)
    } catch (err) {
      send('accounts.getFreshReceiveAddress.fail', err)
    }
  },

  verifyAddress: async (
    send: IPCSend,
    { pathDevice, path }: { pathDevice: string, path: string },
  ) => {
    const transport = await CommNodeHid.open(pathDevice)
    try {
      await verifyAddress({ transport, path })
      send('accounts.verifyAddress.success')
    } catch (err) {
      send('accounts.verifyAddress.fail')
    }
  },
}

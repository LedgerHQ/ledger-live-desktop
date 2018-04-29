// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import Btc from '@ledgerhq/hw-app-btc'

import { getPath, verifyAddress } from './accounts'

export default (sendEvent: Function) => ({
  getAccounts: async ({
    pathDevice,
    currencyId,
    currentAccounts,
  }: {
    pathDevice: string,
    currencyId: string,
    currentAccounts: Array<string>,
  }) => {
    console.warn(
      `NOT IMPLEMENTED: getting account for ${pathDevice} ${currencyId} ${currentAccounts.length}`,
    )
  },
  verifyAddress: async ({ pathDevice, path }: { pathDevice: string, path: string }) => {
    const transport = await CommNodeHid.open(pathDevice)

    try {
      await verifyAddress({ transport, path })

      sendEvent('wallet.verifyAddress.success')
    } catch (err) {
      sendEvent('wallet.verifyAddress.fail')
    }
  },
  checkIfAppOpened: async ({
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
  }) => {
    try {
      const transport = await CommNodeHid.open(devicePath)
      const btc = new Btc(transport)
      if (accountPath) {
        const { bitcoinAddress } = await btc.getWalletPublicKey(accountPath, false, segwit)
        if (bitcoinAddress === accountAddress) {
          sendEvent('wallet.checkIfAppOpened.success', { devicePath })
        } else {
          throw new Error('Address is different')
        }
      }
      if (currencyId) {
        await btc.getWalletPublicKey(getPath({ currencyId, segwit }), false, segwit)
        sendEvent('wallet.checkIfAppOpened.success', { devicePath })
      }
    } catch (err) {
      sendEvent('wallet.checkIfAppOpened.fail', { devicePath })
    }
  },
})

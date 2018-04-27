// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import Btc from '@ledgerhq/hw-app-btc'

import getAllAccounts, { getPath, verifyAddress } from './accounts'

async function getAllAccountsByCurrencyId({ pathDevice, currencyId, currentAccounts, onProgress }) {
  const transport = await CommNodeHid.open(pathDevice)

  if (currencyId === 'bitcoin_testnet') {
    return getAllAccounts({ currencyId, transport, currentAccounts, onProgress })
  }

  throw new Error('Invalid coinType')
}

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
    sendEvent(
      'wallet.getAccounts.start',
      {
        pid: process.pid,
      },
      { kill: false },
    )

    try {
      const data = await getAllAccountsByCurrencyId({
        pathDevice,
        currencyId,
        currentAccounts,
        onProgress: progress => sendEvent('wallet.getAccounts.progress', progress, { kill: false }),
      })

      sendEvent('wallet.getAccounts.success', data)
    } catch (err) {
      sendEvent('wallet.getAccounts.fail', err.stack || err)
    }
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

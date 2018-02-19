// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

import getAllAccounts, { verifyAddress } from './accounts'

async function getAllAccountsByWallet({ pathDevice, wallet, currentAccounts, onProgress }) {
  const transport = await CommNodeHid.open(pathDevice)

  if (wallet === 'btc') {
    return getAllAccounts({ transport, currentAccounts, onProgress })
  }

  throw new Error('invalid wallet')
}

export default (sendEvent: Function) => ({
  getAccounts: async ({
    pathDevice,
    wallet,
    currentAccounts,
  }: {
    pathDevice: string,
    wallet: string,
    currentAccounts: Array<*>,
  }) => {
    try {
      const data = await getAllAccountsByWallet({
        pathDevice,
        wallet,
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
})

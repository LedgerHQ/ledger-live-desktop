// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

import getAllAccounts from './accounts'

async function getAllAccountsByWallet({ path, wallet, currentAccounts, onProgress }) {
  const transport = await CommNodeHid.open(path)

  if (wallet === 'btc') {
    return getAllAccounts({ transport, currentAccounts, onProgress })
  }

  throw new Error('invalid wallet')
}

export default (sendEvent: Function) => ({
  request: async ({
    path,
    wallet,
    currentAccounts,
  }: {
    path: string,
    wallet: string,
    currentAccounts: Array<*>,
  }) => {
    try {
      const data = await getAllAccountsByWallet({
        path,
        wallet,
        currentAccounts,
        onProgress: progress => sendEvent('wallet.request.progress', progress, { kill: false }),
      })
      sendEvent('wallet.request.success', data)
    } catch (err) {
      sendEvent('wallet.request.fail', err.stack || err)
    }
  },
})

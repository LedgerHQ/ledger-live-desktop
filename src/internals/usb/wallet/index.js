// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import getAddresses from './getAddresses'

async function getWallet(path, wallet) {
  const transport = await CommNodeHid.open(path)
  console.log('getWallet', path)
  if (wallet === 'btc') {
    await getAddresses(transport)
  }
  throw new Error('invalid wallet')
}

export default (sendEvent: Function) => ({
  request: async ({ path, wallet }: { path: string, wallet: string }) => {
    try {
      const data = await getWallet(path, wallet)
      sendEvent('wallet.request.success', { path, wallet, data })
    } catch (err) {
      sendEvent('wallet.request.fail', { path, wallet, err: err.stack || err })
    }
  },
})

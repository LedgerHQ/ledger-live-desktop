// @flow

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import Btc from '@ledgerhq/hw-app-btc'

async function getWalletInfos(path, wallet) {
  if (wallet === 'btc') {
    const comm = await CommNodeHid.open(path)
    const btc = new Btc(comm)
    const walletInfos = await btc.getWalletPublicKey(`44'/0'/0'/0`)
    return walletInfos
  }
  throw new Error('invalid wallet')
}

export default (sendEvent: Function) => ({
  infos: {
    request: async ({ path, wallet }: { path: string, wallet: string }) => {
      try {
        const data = await getWalletInfos(path, wallet)
        sendEvent('wallet.infos.success', { path, wallet, data })
      } catch (err) {
        sendEvent('wallet.infos.fail', { path, wallet, err: err.stack || err })
      }
    },
  },
})

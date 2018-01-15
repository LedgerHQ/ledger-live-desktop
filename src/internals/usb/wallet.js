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

export default (send: Function) => ({
  infos: {
    request: async ({ path, wallet }: { path: string, wallet: string }) => {
      try {
        const publicKey = await getWalletInfos(path, wallet)
        send('wallet.infos.success', { path, publicKey })
      } catch (err) {
        send('wallet.infos.fail', { path, err: err.stack || err })
      }
    },
  },
})

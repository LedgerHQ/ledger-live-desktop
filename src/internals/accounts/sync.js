// @flow

import { getAccount, getHDNode, networks } from 'helpers/btc'

const network = networks[1]

function syncAccount({ id, ...currentAccount }) {
  const hdnode = getHDNode({ xpub58: id, network })
  return getAccount({ hdnode, network, segwit: true, ...currentAccount }).then(account => ({
    id,
    ...account,
  }))
}

export default (send: Function) => ({
  all: async ({ accounts }: { accounts: Array<Object> }) => {
    send('accounts.sync.progress', null, { kill: false })

    try {
      const result = await accounts.reduce(
        (promise, account) =>
          promise.then(async results => {
            const result = await syncAccount(account)
            return [...results, result]
          }),
        Promise.resolve([]),
      )

      send('accounts.sync.success', result)
    } catch (err) {
      send('accounts.sync.fail', err.stack || err)
    }
  },
})

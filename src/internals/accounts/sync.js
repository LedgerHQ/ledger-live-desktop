// @flow

import { getAccount, getHDNode, networks } from 'helpers/btc'

const network = networks[1]

function syncAccount({ id, operations, ...currentAccount }) {
  const hdnode = getHDNode({ xpub58: id, network })
  const allTxsHash = operations.map(t => t.hash)
  return getAccount({ hdnode, network, allTxsHash, segwit: true, ...currentAccount }).then(
    account => ({
      id,
      ...account,
    }),
  )
}

export default (send: Function) => ({
  all: async ({ accounts }: { accounts: Array<Object> }) => {
    send('accounts.sync.progress', null, { kill: false })

    try {
      await Promise.all(
        accounts.map(a =>
          syncAccount(a).then(account => send('account.sync.success', account, { kill: false })),
        ),
      )

      send('accounts.sync.success')
    } catch (err) {
      send('accounts.sync.fail', err.stack || err)
    }
  },
})

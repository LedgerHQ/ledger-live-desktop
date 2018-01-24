// @flow

import { getAccount, getHDNode, networks } from 'helpers/btc'

export default (send: Function) => ({
  all: async ({ accounts }: { accounts: Array<Object> }) => {
    const network = networks[1]

    send('accounts.sync.progress', null, { kill: false })

    const syncAccount = ({ id, currentIndex }) => {
      const hdnode = getHDNode({ xpub58: id, network })
      return getAccount({ currentIndex, hdnode, network, segwit: true }).then(account => ({
        id,
        ...account,
      }))
    }

    try {
      const result = await Promise.all(accounts.map(syncAccount))
      send('accounts.sync.success', result)
    } catch (err) {
      send('accounts.sync.fail', err.stack || err)
    }
  },
})

// @flow

import ledger from 'ledger-test-library'
import bitcoin from 'bitcoinjs-lib'

import groupBy from 'lodash/groupBy'
import noop from 'lodash/noop'
import uniqBy from 'lodash/uniqBy'

import type { Transactions } from 'types/common'

const GAP_LIMIT_ADDRESSES = 20

export const networks = [
  {
    ...bitcoin.networks.bitcoin,
    family: 1,
  },
  {
    ...bitcoin.networks.testnet,
    family: 1,
  },
]

export function computeTransaction(addresses: Array<string>) {
  return (t: Object) => {
    const outputVal = t.outputs
      .filter(o => addresses.includes(o.address))
      .reduce((acc, cur) => acc + cur.value, 0)
    const inputVal = t.inputs
      .filter(i => addresses.includes(i.address))
      .reduce((acc, cur) => acc + cur.value, 0)
    const balance = outputVal - inputVal
    return {
      address: t.balance > 0 ? t.inputs[0].address : t.outputs[0].address,
      balance,
      confirmations: t.confirmations,
      hash: t.hash,
      receivedAt: t.received_at,
    }
  }
}

export function getBalanceByDay(transactions: Transactions) {
  const txsByDate = groupBy(transactions, tx => {
    const [date] = new Date(tx.receivedAt).toISOString().split('T')
    return date
  })

  let balance = 0

  return Object.keys(txsByDate)
    .sort()
    .reduce((result, k) => {
      const txs = txsByDate[k]

      balance += txs.reduce((r, v) => {
        r += v.balance
        return r
      }, 0)

      result[k] = balance

      return result
    }, {})
}

export async function getAccount({
  rootPath,
  allAddresses = [],
  allTxsHash = [],
  currentIndex = 0,
  hdnode,
  segwit,
  network,
  coinType,
  asyncDelay = 250,
  onProgress = noop,
}: {
  rootPath: string,
  allAddresses?: Array<string>,
  allTxsHash?: Array<string>,
  currentIndex?: number,
  hdnode: Object,
  segwit: boolean,
  coinType: number,
  network: Object,
  asyncDelay?: number,
  onProgress?: Function,
}) {
  const script = segwit ? parseInt(network.scriptHash, 10) : parseInt(network.pubKeyHash, 10)

  let balance = 0
  let transactions = []
  let lastAddress = null

  const pubKeyToSegwitAddress = (pubKey, scriptVersion) => {
    const script = [0x00, 0x14].concat(Array.from(bitcoin.crypto.hash160(pubKey)))
    const hash160 = bitcoin.crypto.hash160(new Uint8Array(script))
    return bitcoin.address.toBase58Check(hash160, scriptVersion)
  }

  const getPublicAddress = ({ hdnode, path, script, segwit }) => {
    hdnode = hdnode.derivePath(path)
    if (!segwit) {
      return hdnode.getAddress().toString()
    }
    return pubKeyToSegwitAddress(hdnode.getPublicKeyBuffer(), script)
  }

  const getPath = (type, index) => `${type === 'external' ? 0 : 1}/${index}`

  const getAddress = ({ type, index }) => {
    const p = getPath(type, index)
    return {
      type,
      index,
      path: `${rootPath}/${p}`,
      address: getPublicAddress({ hdnode, path: p, script, segwit }),
    }
  }

  const getAsyncAddress = params =>
    new Promise(resolve => setTimeout(() => resolve(getAddress(params)), asyncDelay))

  const getLastAddress = (addresses, txs) => {
    const txsAddresses = [...txs.inputs.map(t => t.address), ...txs.outputs.map(t => t.address)]
    return addresses.find(a => txsAddresses.includes(a.address)) || null
  }

  const nextPath = (index = 0) =>
    Array.from(new Array(GAP_LIMIT_ADDRESSES).keys())
      .reduce(
        (promise, v) =>
          promise.then(async results => {
            const result = await Promise.all([
              getAsyncAddress({ type: 'external', index: v + index }),
              getAsyncAddress({ type: 'internal', index: v + index }),
            ])
            return [...results, result]
          }),
        Promise.resolve([]),
      )
      .then(async results => {
        const addresses = results.reduce((result, v) => [...result, ...v], [])
        const listAddresses = addresses.map(a => a.address)

        allAddresses = [...new Set([...allAddresses, ...listAddresses])]

        let txs = []

        const transactionsOpts = { coin_type: coinType }

        try {
          txs = await ledger.getTransactions(listAddresses, transactionsOpts)
          txs = txs.filter(t => !allTxsHash.includes(t.hash)).reverse()
        } catch (e) {
          console.log('getTransactions', e) // eslint-disable-line no-console
        }

        const hasTransactions = txs.length > 0

        if (hasTransactions) {
          const newTransactions = txs.map(computeTransaction(allAddresses))
          const txHashs = transactions.map(t => t.hash)

          balance = newTransactions
            .filter(t => !txHashs.includes(t.hash))
            .reduce((result, v) => result + v.balance, balance)

          lastAddress = getLastAddress(addresses, txs[0])
          transactions = uniqBy([...transactions, ...newTransactions], t => t.hash)

          onProgress({
            balance,
            transactions: transactions.length,
          })

          return nextPath(index + (GAP_LIMIT_ADDRESSES - 1))
        }

        const { type, ...nextAddress } =
          lastAddress !== null
            ? getAddress({
                type: 'external',
                index: lastAddress.index + 1,
              })
            : getAddress({ type: 'external', index: 0 })

        return {
          ...nextAddress,
          addresses: transactions.length > 0 ? allAddresses : [],
          balance,
          balanceByDay: getBalanceByDay(transactions),
          rootPath,
          transactions,
        }
      })

  if (allAddresses.length === 0 && currentIndex > 0) {
    for (let i = currentIndex; i--; ) {
      allAddresses = [
        ...allAddresses,
        getAddress({ type: 'internal', index: i }).address,
        getAddress({ type: 'external', index: i }).address,
      ]
    }
  }

  return nextPath(currentIndex)
}

export function getHDNode({ xpub58, network }: { xpub58: string, network: Object }) {
  return bitcoin.HDNode.fromBase58(xpub58, network)
}

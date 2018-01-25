// @flow

// import axios from 'axios'
import bitcoin from 'bitcoinjs-lib'
import { formatCurrencyUnit } from '@ledgerhq/common/lib/data/currency'

const blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3)

export function format(v: string | number, options: Object = { alwaysShowSign: true }) {
  return formatCurrencyUnit(
    {
      name: 'bitcoin',
      code: 'BTC',
      symbol: 'b',
      magnitude: 8,
    },
    Number(v),
    options.alwaysShowSign,
    true,
  )
}

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

export function computeTransaction(addresses: Array<*>) {
  // return (transaction: Object) => {
  //   const outputVal = transaction.outputs
  //     .filter(o => addresses.includes(o.address))
  //     .reduce((acc, cur) => acc + cur.value, 0)
  //   const inputVal = transaction.inputs
  //     .filter(i => addresses.includes(i.address))
  //     .reduce((acc, cur) => acc + cur.value, 0)
  //   const balance = outputVal - inputVal
  //   return {
  //     ...transaction,
  //     balance,
  //   }
  // }
  return (transaction: Object) => {
    const outputVal = transaction.out
      .filter(o => addresses.includes(o.addr))
      .reduce((acc, cur) => acc + cur.value, 0)
    const inputVal = transaction.inputs
      .filter(i => addresses.includes(i.prev_out.addr))
      .reduce((acc, cur) => acc + cur.prev_out.value, 0)
    const balance = outputVal - inputVal
    return {
      ...transaction,
      balance,
    }
  }
}

export function getTransactions(addresses: Array<string>) {
  // return axios.get(
  //   `http://api.ledgerwallet.com/blockchain/v2/btc_testnet/addresses/${addresses.join(
  //     ',',
  //   )}/transactions?noToken=true`,
  // )
  return blockexplorer.getMultiAddress(addresses)
}

export async function getAccount({
  allAddresses = [],
  currentIndex = 0,
  hdnode,
  segwit,
  network,
}: {
  allAddresses?: Array<string>,
  currentIndex?: number,
  hdnode: Object,
  segwit: boolean,
  network: Object,
}) {
  const gapLimit = 20
  const script = segwit ? parseInt(network.scriptHash, 10) : parseInt(network.pubKeyHash, 10)

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

  const getAddress = ({ type, index }) => ({
    type,
    index,
    address: getPublicAddress({
      hdnode,
      path: `${type === 'external' ? 0 : 1}/${index}`,
      script,
      segwit,
    }),
  })

  const getLastAddress = (addresses, txs) => {
    const txsAddresses = [...txs.inputs.map(tx => tx.prev_out.addr), ...txs.out.map(tx => tx.addr)]
    const lastAddress = addresses.reverse().find(a => txsAddresses.includes(a.address)) || {
      index: 0,
    }
    return {
      index: lastAddress.index,
      address: getAddress({ type: 'external', index: lastAddress.index + 1 }).address,
    }
  }

  const nextPath = (index = 0) =>
    Promise.all(
      Array.from(new Array(gapLimit).keys()).map(v =>
        Promise.all([
          getAddress({ type: 'external', index: v + index }),
          getAddress({ type: 'internal', index: v + index }),
        ]),
      ),
    ).then(async results => {
      const addresses = results.reduce((result, v) => [...result, ...v], [])
      const listAddresses = addresses.map(a => a.address)

      allAddresses = [...new Set([...allAddresses, ...listAddresses])]

      const { txs } = await getTransactions(listAddresses)

      const hasTransactions = txs.length > 0

      transactions = [...transactions, ...txs.map(computeTransaction(allAddresses))]
      lastAddress = hasTransactions ? getLastAddress(addresses, txs[0]) : lastAddress

      if (hasTransactions) {
        return nextPath(index + (gapLimit - 1))
      }

      return {
        balance: transactions.reduce((result, v) => {
          result += v.balance
          return result
        }, 0),
        allAddresses,
        transactions,
        ...(lastAddress !== null
          ? {
              currentIndex: lastAddress.index,
              address: lastAddress.address,
            }
          : {
              currentIndex: 0,
              address: getAddress({ type: 'external', index: 0 }).address,
            }),
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

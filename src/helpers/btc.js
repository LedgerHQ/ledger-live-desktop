// @flow

import axios from 'axios'
import bitcoin from 'bitcoinjs-lib'
import { formatCurrencyUnit } from '@ledgerhq/common/lib/data/currency'

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
  return (transaction: Object) => {
    const outputVal = transaction.outputs
      .filter(o => addresses.includes(o.address))
      .reduce((acc, cur) => acc + cur.value, 0)
    const inputVal = transaction.inputs
      .filter(i => addresses.includes(i.address))
      .reduce((acc, cur) => acc + cur.value, 0)
    const balance = outputVal - inputVal
    return {
      ...transaction,
      balance,
    }
  }
}

export function getTransactions(addresses: Array<string>) {
  return axios.get(
    `http://api.ledgerwallet.com/blockchain/v2/btc_testnet/addresses/${addresses.join(
      ',',
    )}/transactions?noToken=true`,
  )
}

export async function getAccount({
  currentIndex = 0,
  hdnode,
  segwit,
  network,
}: {
  currentIndex?: number,
  hdnode: Object,
  segwit: boolean,
  network: Object,
}) {
  const script = segwit ? parseInt(network.scriptHash, 10) : parseInt(network.pubKeyHash, 10)

  let transactions = []

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

  const nextPath = (index = 0) => {
    const count = 20
    const getAddress = path => getPublicAddress({ hdnode, path, script, segwit })

    return Promise.all(
      Array.from(Array(count).keys()).map(v =>
        Promise.all([
          getAddress(`0/${v + index}`), // external chain
          getAddress(`1/${v + index}`), // internal chain
        ]),
      ),
    ).then(async results => {
      const currentAddresses = results.reduce((result, v) => [...result, ...v], [])

      const { data: { txs } } = await getTransactions(currentAddresses)

      transactions = [...transactions, ...txs.map(computeTransaction(currentAddresses))]

      if (txs.length > 0) {
        return nextPath(index + (count - 1))
      }

      return {
        balance: transactions.reduce((result, v) => {
          result += v.balance
          return result
        }, 0),
        transactions,
      }
    })
  }

  return nextPath(currentIndex)
}

export function getHDNode({ xpub58, network }: { xpub58: string, network: Object }) {
  return bitcoin.HDNode.fromBase58(xpub58, network)
}

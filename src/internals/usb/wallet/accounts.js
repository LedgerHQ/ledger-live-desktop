/* eslint-disable no-bitwise */

import axios from 'axios'
import bitcoin from 'bitcoinjs-lib'
import bs58check from 'bs58check'
import Btc from '@ledgerhq/hw-app-btc'

import { computeTransaction } from 'helpers/btc'

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

function getCompressPublicKey(publicKey) {
  let compressedKeyIndex
  if (parseInt(publicKey.substring(128, 130), 16) % 2 !== 0) {
    compressedKeyIndex = '03'
  } else {
    compressedKeyIndex = '02'
  }
  const result = compressedKeyIndex + publicKey.substring(2, 66)
  return result
}

function parseHexString(str) {
  const result = []
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16))
    str = str.substring(2, str.length)
  }
  return result
}

function createXpub({ depth, fingerprint, childnum, chainCode, publicKey, network }) {
  return [
    network.toString(16).padStart(8, 0),
    depth.toString(16).padStart(2, 0),
    fingerprint.toString(16).padStart(8, 0),
    childnum.toString(16).padStart(8, 0),
    chainCode,
    publicKey,
  ].join('')
}

function encodeBase58Check(vchIn) {
  vchIn = parseHexString(vchIn)

  return bs58check.encode(Buffer.from(vchIn))
}

function getPath({ coin, account, segwit }) {
  return `${segwit ? 49 : 44}'/${coin}'${account !== undefined ? `/${account}'` : ''}`
}

function pubKeyToSegwitAddress(pubKey, scriptVersion) {
  const script = [0x00, 0x14].concat(Array.from(bitcoin.crypto.hash160(pubKey)))
  const hash160 = bitcoin.crypto.hash160(new Uint8Array(script))
  return bitcoin.address.toBase58Check(hash160, scriptVersion)
}

function getPublicAddress(hdnode, path, script, segwit) {
  hdnode = hdnode.derivePath(path)
  if (!segwit) {
    return hdnode.getAddress().toString()
  }
  return pubKeyToSegwitAddress(hdnode.getPublicKeyBuffer(), script)
}

function getTransactions(addresses) {
  return axios.get(
    `http://api.ledgerwallet.com/blockchain/v2/btc_testnet/addresses/${addresses.join(
      ',',
    )}/transactions?noToken=true`,
  )
}

export async function getAccount({ hdnode, segwit, network }) {
  const script = segwit ? parseInt(network.scriptHash, 10) : parseInt(network.pubKeyHash, 10)

  let transactions = []

  const nextPath = start => {
    const count = 20
    const getAddress = path => getPublicAddress(hdnode, path, script, segwit)

    return Promise.all(
      Array.from(Array(count).keys()).map(v =>
        Promise.all([
          getAddress(`0/${v + start}`), // external chain
          getAddress(`1/${v + start}`), // internal chain
        ]),
      ),
    ).then(async results => {
      const currentAddresses = results.reduce((result, v) => [...result, ...v], [])

      const { data: { txs } } = await getTransactions(currentAddresses)

      transactions = [...transactions, ...txs.map(computeTransaction(currentAddresses))]

      if (txs.length > 0) {
        return nextPath(start + (count - 1))
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

  return nextPath(0)
}

export function getHDNode({ xpub58, network }) {
  return bitcoin.HDNode.fromBase58(xpub58, network)
}

export default async ({ transport, currentAccounts, onProgress, coin = 1, segwit = true }) => {
  const btc = new Btc(transport)

  const network = networks[coin]

  const [p2pkh, p2sh, fam] = [network.pubKeyHash, network.scriptHash, network.family].map(v =>
    v.toString(16).padStart(4, 0),
  )

  await transport.exchange(`e014000005${p2pkh}${p2sh}${fam.substr(-2)}`, [0x9000])

  const getPublicKey = path => btc.getWalletPublicKey(path)

  let result = bitcoin.crypto.sha256(
    await getPublicKey(getPath({ segwit, coin })).then(
      ({ publicKey }) => new Uint8Array(parseHexString(getCompressPublicKey(publicKey))),
    ),
  )
  result = bitcoin.crypto.ripemd160(result)

  onProgress(null)

  const fingerprint = ((result[0] << 24) | (result[1] << 16) | (result[2] << 8) | result[3]) >>> 0

  const getXpub58ByAccount = async ({ account, network }) => {
    const { publicKey, chainCode } = await getPublicKey(getPath({ segwit, coin, account }))
    const compressPublicKey = getCompressPublicKey(publicKey)

    const childnum = (0x80000000 | account) >>> 0

    const xpub = createXpub({
      depth: 3,
      fingerprint,
      childnum,
      chainCode,
      publicKey: compressPublicKey,
      network: network.bip32.public,
    })

    return encodeBase58Check(xpub)
  }

  const getAllAccounts = async (currentAccount = 0, accounts = {}) => {
    const xpub58 = await getXpub58ByAccount({ account: currentAccount, network })

    if (currentAccounts.includes(xpub58)) {
      return getAllAccounts(currentAccount + 1, accounts) // skip existing account
    }

    const hdnode = getHDNode({ xpub58, network })
    const { transactions, balance } = await getAccount({ hdnode, network, segwit })

    onProgress({
      account: currentAccount,
      transactions: transactions.length,
    })

    if (transactions.length > 0) {
      accounts[currentAccount] = {
        id: xpub58,
        balance,
        transactions,
      }
      return getAllAccounts(currentAccount + 1, accounts)
    }

    return accounts
  }

  return getAllAccounts()
}

// @flow

/* eslint-disable no-bitwise */

import bitcoin from 'bitcoinjs-lib'
import bs58check from 'bs58check'
import Btc from '@ledgerhq/hw-app-btc'

import { getAccount, getHDNode, networks } from 'helpers/btc'

type Coin = 0 | 1

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

function parseHexString(str: any) {
  const result = []
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16))
    str = str.substring(2, str.length)
  }
  return result
}

function createXpub({ depth, fingerprint, childnum, chainCode, publicKey, network }) {
  return [
    network.toString(16).padStart(8, '0'),
    depth.toString(16).padStart(2, '0'),
    fingerprint.toString(16).padStart(8, '0'),
    childnum.toString(16).padStart(8, '0'),
    chainCode,
    publicKey,
  ].join('')
}

function encodeBase58Check(vchIn) {
  vchIn = parseHexString(vchIn)

  return bs58check.encode(Buffer.from(vchIn))
}

function getPath({ coin, account, segwit }: { coin: Coin, account?: any, segwit: boolean }) {
  return `${segwit ? 49 : 44}'/${coin}'${account !== undefined ? `/${account}'` : ''}`
}

export default async ({
  transport,
  currentAccounts,
  onProgress,
  coin = 1,
  segwit = true,
}: {
  transport: Object,
  currentAccounts: Array<*>,
  onProgress: Function,
  coin?: Coin,
  segwit?: boolean,
}) => {
  const btc = new Btc(transport)

  const network = networks[coin]

  const [p2pkh, p2sh, fam] = [network.pubKeyHash, network.scriptHash, network.family].map(v =>
    v.toString(16).padStart(4, 0),
  )

  await transport.exchange(Buffer.from(`e014000005${p2pkh}${p2sh}${fam.substr(-2)}`), [0x9000])

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
      return getAllAccounts(currentAccount + 1, accounts) // Skip existing account
    }

    const hdnode = getHDNode({ xpub58, network })
    const account = await getAccount({ hdnode, network, segwit })

    onProgress({
      account: currentAccount,
      transactions: account.transactions.length,
    })

    const hasTransactions = account.transactions.length > 0

    // If the first account is empty we still add it
    if (currentAccount === 0 || hasTransactions) {
      accounts[currentAccount] = {
        id: xpub58,
        ...account,
      }
    }

    if (hasTransactions) {
      return getAllAccounts(currentAccount + 1, accounts)
    }

    return accounts
  }

  return getAllAccounts()
}

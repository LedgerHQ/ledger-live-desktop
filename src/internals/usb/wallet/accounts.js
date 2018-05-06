// @flow

/* eslint-disable no-bitwise */

import bitcoin from 'bitcoinjs-lib'
import bs58check from 'bs58check'
import Btc from '@ledgerhq/hw-app-btc'

import { getAccount, getHDNode, networks } from 'helpers/btc'
import { serializeAccounts } from 'reducers/accounts'

async function sleep(delay, callback) {
  if (delay !== 0) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  return callback()
}

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

export function coinTypeForId(id: string) {
  if (id === 'bitcoin_testnet') return 1
  if (id === 'bitcoin') return 0
  throw new Error('coinTypeForId is a hack and will disappear with libcore')
}

export function getPath({
  currencyId,
  account,
  segwit = true,
}: {
  currencyId: string,
  account?: any,
  segwit: boolean,
}) {
  return `${segwit ? 49 : 44}'/${coinTypeForId(currencyId)}'${
    account !== undefined ? `/${account}'` : ''
  }`
}

export function verifyAddress({
  transport,
  path,
  segwit = true,
}: {
  transport: Object,
  path: string,
  segwit?: boolean,
}) {
  const btc = new Btc(transport)

  return btc.getWalletPublicKey(path, true, segwit)
}

export default async ({
  transport,
  currentAccounts,
  onProgress,
  currencyId = 'bitcoin_testnet',
  segwit = true,
  nextAccountDelay = 1e3,
}: {
  transport: Object,
  currentAccounts: Array<*>,
  onProgress: Function,
  currencyId?: string,
  segwit?: boolean,
  nextAccountDelay?: number,
}) => {
  const btc = new Btc(transport)

  const network = networks[currencyId]

  const [p2pkh, p2sh, fam] = [network.pubKeyHash, network.scriptHash, network.family].map(v =>
    v.toString(16).padStart(4, 0),
  )

  await transport.exchange(Buffer.from(`e014000005${p2pkh}${p2sh}${fam.substr(-2)}`), [0x9000])

  const getPublicKey = path => btc.getWalletPublicKey(path)

  let result = bitcoin.crypto.sha256(
    await getPublicKey(getPath({ segwit, currencyId })).then(
      ({ publicKey }) => new Uint8Array(parseHexString(getCompressPublicKey(publicKey))),
    ),
  )
  result = bitcoin.crypto.ripemd160(result)

  onProgress(null)

  const fingerprint = ((result[0] << 24) | (result[1] << 16) | (result[2] << 8) | result[3]) >>> 0

  const getXpub58ByPath = async ({ path, account, network }) => {
    const { publicKey, chainCode } = await getPublicKey(path)
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

  const getAllAccounts = async (currentAccount = 0, accounts = []) => {
    const path = getPath({ segwit, currencyId, account: currentAccount })
    const xpub58 = await getXpub58ByPath({ path, account: currentAccount, network })

    if (currentAccounts.includes(xpub58)) {
      return getAllAccounts(currentAccount + 1, accounts) // Skip existing account
    }

    const hdnode = getHDNode({ xpub58, network })
    const account = await getAccount({
      asyncDelay: 0,
      currencyId,
      accountId: xpub58,
      hdnode,
      network,
      rootPath: path,
      segwit,
      onProgress: ({ operations, ...progress }) =>
        operations.length > 0 &&
        onProgress({ id: xpub58, accountIndex: currentAccount, operations, ...progress }),
    })

    const hasOperations = account.operations.length > 0

    accounts.push({
      id: xpub58,
      ...account,
    })

    if (hasOperations) {
      const nextAccount = await sleep(nextAccountDelay, () =>
        getAllAccounts(currentAccount + 1, accounts),
      )

      return nextAccount
    }

    const result = await sleep(nextAccountDelay, () => accounts)

    return serializeAccounts(result)
  }

  return getAllAccounts()
}

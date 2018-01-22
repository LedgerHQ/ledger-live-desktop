/* eslint-disable no-bitwise */

import axios from 'axios'
import bitcoin from 'bitcoinjs-lib'
import bs58check from 'bs58check'
import Btc from '@ledgerhq/hw-app-btc'

const networks = [
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

function createXPUB({ depth, fingerprint, childnum, chainCode, publicKey, network }) {
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
  return bs58check.encode(new Uint8Array(vchIn))
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

export default async transport => {
  const coin = 1
  const account = 0
  const segwit = true

  const network = networks[coin]

  const [p2pkh, p2sh, fam] = [network.pubKeyHash, network.scriptHash, network.family].map(v =>
    v.toString(16).padStart(4, 0),
  )

  await transport.exchange(`e014000005${p2pkh}${p2sh}${fam.substr(-2)}`, [0x9000])

  const btc = new Btc(transport)

  const getPublicKey = path => btc.getWalletPublicKey(path)

  let result = bitcoin.crypto.sha256(
    await getPublicKey(getPath({ segwit, coin })).then(
      ({ publicKey }) => new Uint8Array(parseHexString(getCompressPublicKey(publicKey))),
    ),
  )
  result = bitcoin.crypto.ripemd160(result)

  const fingerprint = ((result[0] << 24) | (result[1] << 16) | (result[2] << 8) | result[3]) >>> 0

  const { publicKey, chainCode } = await getPublicKey(getPath({ segwit, coin, account }))
  const compressPublicKey = getCompressPublicKey(publicKey)

  const childnum = (0x80000000 | account) >>> 0
  const xpub = createXPUB({
    depth: 3,
    fingerprint,
    childnum,
    chainCode,
    publicKey: compressPublicKey,
    network: network.bip32.public,
  })

  const xpub58 = encodeBase58Check(xpub)

  const hdnode = bitcoin.HDNode.fromBase58(xpub58, network)

  const script = segwit ? parseInt(network.scriptHash, 10) : parseInt(network.pubKeyHash, 10)

  const nextPath = async i => {
    if (i <= 0x7fffffff) {
      for (let j = 0; j < 2; j++) {
        const path = `${j}/${i}`

        const address = getPublicAddress(hdnode, path, script, segwit)
        console.log('address', address)

        const { data: { txs } } = await getTransactions(address) // eslint-disable-line no-await-in-loop

        console.log('txs', txs.length)

        if (j === 1 && i < 10) {
          nextPath(++i)
        }
      }
    } else {
      console.log('meeeh')
    }
  }

  nextPath(0)
}

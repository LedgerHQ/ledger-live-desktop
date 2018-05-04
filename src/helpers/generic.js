/* eslint-disable no-bitwise */

import bitcoin from 'bitcoinjs-lib'
import bs58 from 'bs58'

export function toHexDigit(number) {
  const digits = '0123456789abcdef'
  return digits.charAt(number >> 4) + digits.charAt(number & 0x0f)
}

export function toHexInt(number) {
  return (
    toHexDigit((number >> 24) & 0xff) +
    toHexDigit((number >> 16) & 0xff) +
    toHexDigit((number >> 8) & 0xff) +
    toHexDigit(number & 0xff)
  )
}

export function encodeBase58Check(vchIn) {
  // vchIn = parseHexString(vchIn)
  let chksum = bitcoin.crypto.sha256(vchIn)
  chksum = bitcoin.crypto.sha256(chksum)
  chksum = chksum.slice(0, 4)
  const hash = vchIn.concat(Array.from(chksum))
  return bs58.encode(hash)
}

export function parseHexString(str) {
  const result = []
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16))
    str = str.substring(2, str.length)
  }
  return result
}

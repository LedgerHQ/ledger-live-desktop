// @flow

import invariant from 'invariant'

type Params = {
  type: string,
  version: string,
  xpub: string,
  walletName: string,
}

export function encode({ type, version, xpub, walletName }: Params) {
  return `${type}:${version}:${xpub}:${walletName}`
}

export function decode(accountId: string): Params {
  invariant(typeof accountId === 'string', 'accountId is not a string')
  const splitted = accountId.split(':')
  invariant(splitted.length === 4, 'invalid size for accountId')
  const [type, version, xpub, walletName] = splitted
  return { type, version, xpub, walletName }
}

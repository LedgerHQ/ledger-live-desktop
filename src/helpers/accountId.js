// @flow

type Params = {
  type: string,
  xpub: string,
  walletName: string,
}

export function encode({ type, xpub, walletName }: Params) {
  return `${type}:${xpub}:${walletName}`
}

export function decode(accountId: string) {
  const [type, xpub, walletName] = accountId.split(':')
  return { type, xpub, walletName }
}

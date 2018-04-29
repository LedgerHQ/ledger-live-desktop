// @flow

/* eslint-disable no-bitwise */

import Btc from '@ledgerhq/hw-app-btc'

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

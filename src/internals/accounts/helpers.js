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

export async function getFreshReceiveAddress({
  currencyId,
  accountIndex,
}: {
  currencyId: string,
  accountIndex: number,
}) {
  const core = require('ledger-core')
  const wallet = await core.getWallet(currencyId)
  const account = await wallet.getAccount(accountIndex)
  const addresses = await account.getFreshPublicAddresses()
  if (!addresses.length) {
    throw new Error('No fresh addresses')
  }
  return addresses[0]
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

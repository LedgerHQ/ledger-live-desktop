// @flow

/* eslint-disable no-bitwise */

import Btc from '@ledgerhq/hw-app-btc'

import { findCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

export function coinTypeForId(id: string) {
  const currency = findCryptoCurrencyById(id)
  return currency ? currency.coinType : 0
}

export function getPath({
  currencyId,
  account,
  segwit = true,
}: {
  currencyId: string,
  account?: any,
  segwit?: boolean,
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
  // TODO: investigate why importing it on file scope causes trouble
  const core = require('init-ledger-core')()

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

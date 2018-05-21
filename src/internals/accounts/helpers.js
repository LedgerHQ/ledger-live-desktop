// @flow

/* eslint-disable no-bitwise */

import Btc from '@ledgerhq/hw-app-btc'

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
  console.warn('DEPRECATED use devices.getAddress with verify option')
  const btc = new Btc(transport)

  return btc.getWalletPublicKey(path, true, segwit)
}

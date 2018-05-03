// @flow

//                          Scan accounts on device
//                          -----------------------
//
//                                _   ,--()
//                               ( )-'-.------|>
//                                "     `--[]
//

import Btc from '@ledgerhq/hw-app-btc'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

import type { Account } from '@ledgerhq/wallet-common/lib/types'

type Props = {
  devicePath: string,
  currencyId: string,
}

async function getOrCreateWallet(currencyId) {
  const core = require('ledger-core')
  try {
    const wallet = await core.getWallet(currencyId)
    return wallet
  } catch (err) {
    const currency = await core.getCurrency(currencyId)
    const wallet = await core.createWallet(currencyId, currency)
    return wallet
  }
}

async function scanNextAccount(wallet, hwApp, accountIndex = 0, accounts = []) {
  const core = require('ledger-core')
  console.log(`>> On index ${accountIndex}...`)
  const account = await core.createAccount(wallet, hwApp)
  await core.syncAccount(account)
  const utxoCount = await account.asBitcoinLikeAccount().getUTXOCount()
  console.log(`>> Found ${utxoCount} utxos`)
  if (utxoCount === 0) {
    return accounts
  }
  accounts.push(account)
  return scanNextAccount(wallet, hwApp, accountIndex + 1, accounts)
}

export default async function scanAccountsOnDevice(props: Props): Account[] {
  try {
    const { devicePath, currencyId } = props
    const wallet = await getOrCreateWallet(currencyId)
    const transport = await CommNodeHid.open(devicePath)
    const hwApp = new Btc(transport)
    console.log(`>> Scanning accounts...`)
    const accounts = await scanNextAccount(wallet, hwApp)
    console.log(accounts)
    return []
  } catch (err) {
    console.log(err)
    return []
  }
}

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

const OPS_LIMIT = 10000

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

  const utxosCount = await account.asBitcoinLikeAccount().getUTXOCount()
  console.log(`>> utxosCount is ${utxosCount}`)

  console.log(`>> about to query operations`)
  const query = account.queryOperations()

  console.log(`>> about to execute query`)
  const ops = await query.limit(OPS_LIMIT).execute()

  console.log(`>> Found ${ops.length} operations`)
  accounts.push(account)

  // returns if the current index points on an account with no ops
  if (!ops.length) {
    return accounts
  }

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

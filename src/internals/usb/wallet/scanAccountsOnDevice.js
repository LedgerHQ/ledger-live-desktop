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

async function scanNextAccount({ wallet, hwApp, accountIndex = 0, accountsCount, accounts = [] }) {
  const core = require('ledger-core')

  // create account only if account has not been scanned yet
  // if it has already been created, we just need to get it, and sync it
  const hasBeenScanned = accountIndex < accountsCount

  console.log(`>> On index ${accountIndex} hasBeenScanned: ${hasBeenScanned}...`)
  const account = hasBeenScanned
    ? await wallet.getAccount(accountIndex)
    : await core.createAccount(wallet, hwApp)

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
  if (utxosCount === 0) {
    return accounts
  }

  return scanNextAccount({
    wallet,
    hwApp,
    accountIndex: accountIndex + 1,
    accounts,
  })
}

export default async function scanAccountsOnDevice(props: Props): Account[] {
  try {
    const { devicePath, currencyId } = props
    const wallet = await getOrCreateWallet(currencyId)
    const accountsCount = await wallet.getAccountCount()
    const transport = await CommNodeHid.open(devicePath)
    const hwApp = new Btc(transport)
    console.log(`accountsCount: ${accountsCount}`)
    console.log(`>> Scanning accounts...`)
    const accounts = await scanNextAccount({
      wallet,
      hwApp,
      accountsCount,
    })
    return accounts
  } catch (err) {
    console.log(err)
    return []
  }
}

// @flow

//                          Scan accounts on device
//                          -----------------------
//
//                                _   ,--()
//                               ( )-'-.------|>
//                                "     `--[]
//

import core from 'ledger-core'
import Btc from '@ledgerhq/hw-app-btc'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

import type { Account } from '@ledgerhq/wallet-common/lib/types'

type Props = {
  devicePath: string,
  currencyId: string,
}

async function getOrCreateWallet(walletPool, currencyId) {
  try {
    const wallet = await core.getWallet(walletPool, currencyId)
    return wallet
  } catch (err) {
    const currency = await core.getCurrency(walletPool, currencyId)
    const wallet = await core.createWallet(walletPool, currencyId, currency)
    return wallet
  }
}

async function scanNextAccount(wallet, hwApp, accountIndex = 0) {
  console.log(`creating an account with index ${accountIndex}`)
  const account = await core.createAccount(wallet, hwApp)
  console.log(`synchronizing account ${accountIndex}`)
  await core.syncAccount(account)
  console.log(`finished sync`)
  const utxoCount = await account.asBitcoinLikeAccount().getUTXOCount()
  console.log(`utxoCount = ${utxoCount}`)
}

export default async function scanAccountsOnDevice(props: Props): Account[] {
  try {
    const { devicePath, currencyId } = props
    const walletPool = core.createWalletPool()
    console.log(`get or create wallet`)
    const wallet = await getOrCreateWallet(walletPool, currencyId)
    console.log(`open device`)
    const transport = await CommNodeHid.open(devicePath)
    console.log(`create app`)
    const hwApp = new Btc(transport)
    console.log(`scan account`)
    const accounts = await scanNextAccount(wallet, hwApp)
    console.log(accounts)
    return []
  } catch (err) {
    console.log(err)
  }
}

// @flow

//                          Scan accounts on device
//                          -----------------------
//
//                                _   ,--()
//                               ( )-'-.------|>
//                                "     `--[]
//

import Btc from '@ledgerhq/hw-app-btc'
import padStart from 'lodash/padStart'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

import type { AccountRaw } from '@ledgerhq/live-common/lib/types'

import { toHexInt, encodeBase58Check } from 'helpers/generic'

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

  const account = hasBeenScanned
    ? await wallet.getAccount(accountIndex)
    : await core.createAccount(wallet, hwApp)

  await core.syncAccount(account)

  const query = account.queryOperations()
  const ops = await query.limit(OPS_LIMIT).execute()

  accounts.push(account)

  // returns if the current index points on an account with no ops
  if (ops.length === 0) {
    return accounts
  }

  return scanNextAccount({
    wallet,
    hwApp,
    accountIndex: accountIndex + 1,
    accounts,
  })
}

export default async function scanAccountsOnDevice(props: Props): AccountRaw[] {
  try {
    const core = require('ledger-core')

    const { devicePath, currencyId } = props
    const wallet = await getOrCreateWallet(currencyId)
    const accountsCount = await wallet.getAccountCount()
    const transport = await CommNodeHid.open(devicePath)
    const hwApp = new Btc(transport)

    // retrieve native accounts
    const njsAccounts = await scanNextAccount({ wallet, hwApp, accountsCount })

    // create AccountRaw[]
    const rawAccounts = await njsAccounts.reduce(async (promise, njsAccount, i) => {
      const rawAccounts = await promise
      const rawAccount = await buildRawAccount({
        njsAccount,
        accountIndex: i,
        wallet,
        currencyId,
        core,
        hwApp,
      })
      return [...rawAccounts, rawAccount]
    }, Promise.resolve([]))

    return rawAccounts
  } catch (err) {
    console.log(err)
    return []
  }
}

async function buildRawAccount({ njsAccount, wallet, currencyId, core, hwApp, accountIndex }) {
  const jsCurrency = getCryptoCurrencyById(currencyId)

  // retrieve xpub
  const { derivations } = await wallet.getAccountCreationInfo(accountIndex)
  const [walletPath, accountPath] = derivations
  const { publicKey, chainCode, bitcoinAddress } = await hwApp.getWalletPublicKey(accountPath)
  const nativeDerivationPath = core.createDerivationPath(accountPath)
  const depth = nativeDerivationPath.getDepth()
  const childNum = nativeDerivationPath.getChildNum(accountIndex)
  const fingerprint = core.createBtcFingerprint(publicKey)
  const { bitcoinLikeNetworkParameters } = wallet.getCurrency()
  const network = Buffer.from(bitcoinLikeNetworkParameters.XPUBVersion).readUIntBE(0, 4)
  const xpub = createXPUB(depth, fingerprint, childNum, chainCode, publicKey, network)

  const { height: blockHeight } = await njsAccount.getLastBlock()

  const rawAccount: AccountRaw = {
    id: xpub,
    xpub,
    path: accountPath, // TODO: this should be called `accountPath` in Account/AccountRaw types
    rootPath: walletPath, // TODO: this should be `walletPath` in Account/AccountRaw types
    name: '', // TODO: placeholder name?
    address: bitcoinAddress, // TODO: discuss about the utility of storing it here
    balance: 0,
    blockHeight,
    archived: false,
    index: accountIndex,
    balanceByDay: {},
    operations: [],
    currencyId,
    unitMagnitude: jsCurrency.units[0].magnitude,
    lastSyncDate: new Date().toISOString(),
  }

  return rawAccount
}

/**
 * TODO: should be calculated by the lib core
 *       why? because the xpub generated here seems invalid
 */
function createXPUB(depth, fingerprint, childnum, chaincode, publicKey, network) {
  let xpub = toHexInt(network)
  xpub += padStart(depth.toString(16), 2, '0')
  xpub += padStart(fingerprint.toString(16), 8, '0')
  xpub += padStart(childnum.toString(16), 8, '0')
  xpub += chaincode
  xpub += publicKey
  return encodeBase58Check(xpub)
}

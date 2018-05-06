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
import type { NJSAccount } from 'ledger-core/src/ledgercore_doc'

import { toHexInt, encodeBase58Check } from 'helpers/generic'

const OPS_LIMIT = 10000

type Props = {
  devicePath: string,
  currencyId: string,
  onAccountScanned: Function,
}

export default async function scanAccountsOnDevice(props: Props): AccountRaw[] {
  const { devicePath, currencyId, onAccountScanned } = props

  // instanciate app on device
  const transport = await CommNodeHid.open(devicePath)
  const hwApp = new Btc(transport)

  // compute wallet identifier
  const deviceIdentifiers = await hwApp.getWalletPublicKey(devicePath)
  const { publicKey } = deviceIdentifiers
  const WALLET_IDENTIFIER = `${publicKey}__${currencyId}`

  // retrieve or create the wallet
  const wallet = await getOrCreateWallet(WALLET_IDENTIFIER, currencyId)
  const accountsCount = await wallet.getAccountCount()

  // recursively scan all accounts on device on the given app
  // new accounts will be created in sqlite, existing ones will be updated
  const accounts = await scanNextAccount({
    wallet,
    hwApp,
    currencyId,
    accountsCount,
    accountIndex: 0,
    accounts: [],
    onAccountScanned,
  })

  return accounts
}

async function scanNextAccount(props) {
  const {
    wallet,
    hwApp,
    currencyId,
    accountsCount,
    accountIndex,
    accounts,
    onAccountScanned,
  } = props

  // TODO: investigate why importing it on file scope causes trouble
  const core = require('ledger-core')

  console.log(`>> Scanning account ${accountIndex}`)

  // create account only if account has not been scanned yet
  // if it has already been created, we just need to get it, and sync it
  const hasBeenScanned = accountIndex < accountsCount

  const njsAccount = hasBeenScanned
    ? await wallet.getAccount(accountIndex)
    : await core.createAccount(wallet, hwApp)

  await core.syncAccount(njsAccount)

  const query = njsAccount.queryOperations()
  const ops = await query.limit(OPS_LIMIT).execute()

  const account = await buildRawAccount({
    njsAccount,
    accountIndex,
    wallet,
    currencyId,
    core,
    hwApp,
  })

  // trigger event
  onAccountScanned(account)

  accounts.push(account)

  // returns if the current index points on an account with no ops
  if (ops.length === 0) {
    return accounts
  }

  return scanNextAccount({ ...props, accountIndex: accountIndex + 1 })
}

async function getOrCreateWallet(WALLET_IDENTIFIER, currencyId) {
  // TODO: investigate why importing it on file scope causes trouble
  const core = require('ledger-core')
  try {
    const wallet = await core.getWallet(WALLET_IDENTIFIER)
    return wallet
  } catch (err) {
    const currency = await core.getCurrency(currencyId)
    const wallet = await core.createWallet(WALLET_IDENTIFIER, currency)
    return wallet
  }
}

async function buildRawAccount({
  njsAccount,
  wallet,
  currencyId,
  // core,
  hwApp,
  accountIndex,
}: {
  njsAccount: NJSAccount,
  wallet: NJSWallet,
  currencyId: string,
  accountIndex: number,
  core: Object,
  hwApp: Object,
}) {
  const jsCurrency = getCryptoCurrencyById(currencyId)

  // retrieve xpub
  const { derivations } = await wallet.getAccountCreationInfo(accountIndex)
  const [walletPath, accountPath] = derivations
  const { publicKey, chainCode, bitcoinAddress } = await hwApp.getWalletPublicKey(accountPath)

  // TODO: wtf is happening?
  //
  // const nativeDerivationPath = core.createDerivationPath(accountPath)
  // const depth = nativeDerivationPath.getDepth()
  const depth = 'depth'
  // const childNum = nativeDerivationPath.getChildNum(accountIndex)
  const childNum = 'childNum'
  // const fingerprint = core.createBtcFingerprint(publicKey)
  const fingerprint = 'fingerprint'

  const { bitcoinLikeNetworkParameters } = wallet.getCurrency()
  const network = Buffer.from(bitcoinLikeNetworkParameters.XPUBVersion).readUIntBE(0, 4)
  const xpub = createXPUB(depth, fingerprint, childNum, chainCode, publicKey, network)

  // blockHeight
  const { height: blockHeight } = await njsAccount.getLastBlock()

  // get a bunch of fresh addresses
  const rawAddresses = await njsAccount.getFreshPublicAddresses()
  // TODO: waiting for libcore
  const addresses = rawAddresses.map((strAddr, i) => ({
    str: strAddr,
    path: `${accountPath}/${i}'`,
  }))

  const rawAccount: AccountRaw = {
    id: xpub,
    xpub,
    path: accountPath, // TODO: this should be called `accountPath` in Account/AccountRaw types
    rootPath: walletPath, // TODO: this should be `walletPath` in Account/AccountRaw types
    name: `Account ${accountIndex}`, // TODO: placeholder name?
    address: bitcoinAddress, // TODO: discuss about the utility of storing it here
    addresses,
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

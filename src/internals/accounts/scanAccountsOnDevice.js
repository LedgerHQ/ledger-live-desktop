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

export default async function scanAccountsOnDevice(props: Props): Promise<AccountRaw[]> {
  const { devicePath, currencyId, onAccountScanned } = props

  // instanciate app on device
  const transport = await CommNodeHid.open(devicePath)
  const hwApp = new Btc(transport)

  const commonParams = {
    hwApp,
    currencyId,
    onAccountScanned,
    devicePath,
  }

  // scan segwit AND non-segwit accounts
  const segwitAccounts = await scanAccountsOnDeviceBySegwit({ ...commonParams, isSegwit: true })
  const nonSegwitAccounts = await scanAccountsOnDeviceBySegwit({ ...commonParams, isSegwit: false })

  const accounts = [...segwitAccounts, ...nonSegwitAccounts]

  return accounts
}

async function scanAccountsOnDeviceBySegwit({
  hwApp,
  currencyId,
  onAccountScanned,
  devicePath,
  isSegwit,
}) {
  // compute wallet identifier
  const isVerify = false
  const deviceIdentifiers = await hwApp.getWalletPublicKey(devicePath, isVerify, isSegwit)
  const { publicKey } = deviceIdentifiers

  const WALLET_IDENTIFIER = `${publicKey}__${currencyId}${isSegwit ? '_segwit' : ''}`

  // retrieve or create the wallet
  const wallet = await getOrCreateWallet(WALLET_IDENTIFIER, currencyId, isSegwit)
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
    isSegwit,
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
    isSegwit,
  } = props

  // TODO: investigate why importing it on file scope causes trouble
  const core = require('init-ledger-core')()

  console.log(`>> Scanning account ${accountIndex} - isSegwit: ${isSegwit.toString()}`)

  // create account only if account has not been scanned yet
  // if it has already been created, we just need to get it, and sync it
  const hasBeenScanned = accountIndex < accountsCount

  const njsAccount = hasBeenScanned
    ? await wallet.getAccount(accountIndex)
    : await core.createAccount(wallet, hwApp)

  if (!hasBeenScanned) {
    await core.syncAccount(njsAccount)
  }

  const query = njsAccount.queryOperations()
  const ops = await query.limit(OPS_LIMIT).execute()

  console.log(`found ${ops.length} transactions`)

  const account = await buildRawAccount({
    njsAccount,
    isSegwit,
    accountIndex,
    wallet,
    currencyId,
    core,
    hwApp,
    ops,
  })

  // returns if the current index points on an account with no ops
  if (ops.length === 0) {
    return accounts
  }

  // trigger event
  onAccountScanned(account)

  accounts.push(account)

  return scanNextAccount({ ...props, accountIndex: accountIndex + 1 })
}

async function getOrCreateWallet(WALLET_IDENTIFIER, currencyId, isSegwit) {
  // TODO: investigate why importing it on file scope causes trouble
  const core = require('init-ledger-core')()
  try {
    const wallet = await core.getWallet(WALLET_IDENTIFIER)
    return wallet
  } catch (err) {
    const currency = await core.getCurrency(currencyId)
    const walletConfig = isSegwit
      ? {
          KEYCHAIN_ENGINE: 'BIP49_P2SH',
          KEYCHAIN_DERIVATION_SCHEME: "49'/<coin_type>'/<account>'/<node>/<address>",
        }
      : undefined
    const njsWalletConfig = core.createWalletConfig(walletConfig)
    const wallet = await core.createWallet(WALLET_IDENTIFIER, currency, njsWalletConfig)
    return wallet
  }
}

async function buildRawAccount({
  njsAccount,
  isSegwit,
  wallet,
  currencyId,
  core,
  hwApp,
  accountIndex,
  ops,
}: {
  njsAccount: NJSAccount,
  isSegwit: boolean,
  // $FlowFixMe
  wallet: NJSWallet,
  currencyId: string,
  accountIndex: number,
  core: Object,
  hwApp: Object,
  // $FlowFixMe
  ops: NJSOperation[],
}) {
  const njsBalanceHistory = await njsAccount.getBalanceHistory(
    new Date('2018-05-01').toISOString(),
    new Date('2018-06-01').toISOString(),
    core.TIME_PERIODS.DAY,
  )

  const balanceHistory = njsBalanceHistory.map(njsAmount => njsAmount.toLong())

  const njsBalance = await njsAccount.getBalance()
  const balance = njsBalance.toLong()

  const jsCurrency = getCryptoCurrencyById(currencyId)

  // retrieve xpub
  const { derivations } = await wallet.getAccountCreationInfo(accountIndex)
  const [walletPath, accountPath] = derivations

  console.log(`so, the account path is ${accountPath}`)

  const isVerify = false
  const { publicKey, chainCode, bitcoinAddress } = await hwApp.getWalletPublicKey(
    accountPath,
    isVerify,
    isSegwit,
  )

  const nativeDerivationPath = core.createDerivationPath(accountPath)
  const depth = nativeDerivationPath.getDepth()
  // const depth = 'depth'
  const childNum = nativeDerivationPath.getChildNum(accountIndex)
  // const childNum = 'childNum'
  const fingerprint = core.createBtcFingerprint(publicKey)
  // const fingerprint = 'fingerprint'

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

  const operations = ops.map(op => {
    const hash = op.getUid()
    return {
      id: hash,
      hash,
      address: '',
      senders: op.getSenders(),
      recipients: op.getRecipients(),
      blockHeight: op.getBlockHeight(),
      accountId: xpub,
      date: op.getDate().toISOString(),

      amount: op.getAmount().toLong(),
    }
  })

  const rawAccount: AccountRaw = {
    id: xpub,
    xpub,
    path: accountPath,
    walletPath,
    name: `Account ${accountIndex}`, // TODO: placeholder name?
    isSegwit,
    address: bitcoinAddress,
    addresses,
    balance,
    blockHeight,
    archived: false,
    index: accountIndex,
    balanceByDay: {},
    operations,
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
  // $FlowFixMe
  xpub += padStart(depth.toString(16), 2, '0')
  // $FlowFixMe
  xpub += padStart(fingerprint.toString(16), 8, '0')
  // $FlowFixMe
  xpub += padStart(childnum.toString(16), 8, '0')
  xpub += chaincode
  xpub += publicKey
  return encodeBase58Check(xpub)
}

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
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

import type Transport from '@ledgerhq/hw-transport'

import type { AccountRaw } from '@ledgerhq/live-common/lib/types'
import type { NJSAccount, NJSOperation } from 'ledger-core/src/ledgercore_doc'

type Props = {
  devicePath: string,
  currencyId: string,
  onAccountScanned: Function,
}

export default async function scanAccountsOnDevice(props: Props): Promise<AccountRaw[]> {
  const { devicePath, currencyId, onAccountScanned } = props

  // instanciate app on device
  const transport: Transport<*> = await CommNodeHid.open(devicePath)
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

  console.log(`>> Scanning account ${accountIndex} - isSegwit: ${isSegwit.toString()}`) // eslint-disable-line no-console

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
  const ops = await query.complete().execute()

  const account = await buildAccountRaw({
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

async function buildAccountRaw({
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
  const balanceByDay = ops.length
    ? await getBalanceByDaySinceOperation({
        njsAccount,
        njsOperation: ops[0],
        core,
      })
    : {}

  const njsBalance = await njsAccount.getBalance()
  const balance = njsBalance.toLong()

  const jsCurrency = getCryptoCurrencyById(currencyId)

  // retrieve xpub
  const { derivations } = await wallet.getAccountCreationInfo(accountIndex)
  const [walletPath, accountPath] = derivations

  const isVerify = false
  const { bitcoinAddress } = await hwApp.getWalletPublicKey(accountPath, isVerify, isSegwit)

  const xpub = bitcoinAddress

  // blockHeight
  const { height: blockHeight } = await njsAccount.getLastBlock()

  // get a bunch of fresh addresses
  const rawAddresses = await njsAccount.getFreshPublicAddresses()
  // TODO: waiting for libcore
  const addresses = rawAddresses.map((strAddr, i) => ({
    str: strAddr,
    path: `${accountPath}/${i}'`,
  }))

  const operations = ops.map(op => buildOperationRaw({ core, op, xpub }))

  const rawAccount: AccountRaw = {
    id: xpub,
    xpub,
    path: accountPath,
    walletPath,
    name: `Account ${accountIndex}${isSegwit ? ' (segwit)' : ''}`, // TODO: placeholder name?
    isSegwit,
    address: bitcoinAddress,
    addresses,
    balance,
    blockHeight,
    archived: false,
    index: accountIndex,
    balanceByDay,
    operations,
    currencyId,
    unitMagnitude: jsCurrency.units[0].magnitude,
    lastSyncDate: new Date().toISOString(),
  }

  return rawAccount
}

function buildOperationRaw({ core, op, xpub }: { core: Object, op: NJSOperation, xpub: string }) {
  const id = op.getUid()
  const bitcoinLikeOperation = op.asBitcoinLikeOperation()
  const bitcoinLikeTransaction = bitcoinLikeOperation.getTransaction()
  const hash = bitcoinLikeTransaction.getHash()
  const operationType = op.getOperationType()
  const absoluteAmount = op.getAmount().toLong()

  // if transaction is a send, amount becomes negative
  const amount = operationType === core.OPERATION_TYPES.SEND ? -absoluteAmount : absoluteAmount

  return {
    id,
    hash,
    address: '',
    senders: op.getSenders(),
    recipients: op.getRecipients(),
    blockHeight: op.getBlockHeight(),
    accountId: xpub,
    date: op.getDate().toISOString(),
    amount,
  }
}

async function getBalanceByDaySinceOperation({
  njsAccount,
  njsOperation,
  core,
}: {
  njsAccount: NJSAccount,
  njsOperation: NJSOperation,
  core: Object,
}) {
  const startDate = njsOperation.getDate()
  // set end date to tomorrow
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 1)
  const njsBalanceHistory = await njsAccount.getBalanceHistory(
    startDate.toISOString(),
    endDate.toISOString(),
    core.TIME_PERIODS.DAY,
  )
  let i = 0
  const res = {}
  while (!areSameDay(startDate, endDate)) {
    const dateSQLFormatted = startDate.toISOString().substr(0, 10)
    const balanceDay = njsBalanceHistory[i]
    if (balanceDay) {
      res[dateSQLFormatted] = njsBalanceHistory[i].toLong()
    } else {
      console.warn(`No balance for day ${dateSQLFormatted}. This is a bug.`) // eslint-disable-line no-console
    }
    startDate.setDate(startDate.getDate() + 1)
    i++
  }

  return res
}

function areSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

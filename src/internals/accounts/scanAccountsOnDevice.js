// @flow

//                          Scan accounts on device
//                          -----------------------
//
//                                _   ,--()
//                               ( )-'-.------|>
//                                "     `--[]
//

import Btc from '@ledgerhq/hw-app-btc'
import { withDevice } from 'helpers/deviceAccess'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

import type { AccountRaw, OperationRaw, OperationType } from '@ledgerhq/live-common/lib/types'
import type { NJSAccount, NJSOperation } from '@ledgerhq/ledger-core/src/ledgercore_doc'

type Props = {
  devicePath: string,
  currencyId: string,
  onAccountScanned: Function,
}

export default function scanAccountsOnDevice(props: Props): Promise<AccountRaw[]> {
  const { devicePath, currencyId, onAccountScanned } = props

  return withDevice(devicePath)(async transport => {
    const hwApp = new Btc(transport)

    const commonParams = {
      hwApp,
      currencyId,
      onAccountScanned,
      devicePath,
    }

    // scan segwit AND non-segwit accounts
    const nonSegwitAccounts = await scanAccountsOnDeviceBySegwit({
      ...commonParams,
      isSegwit: false,
    })
    const segwitAccounts = await scanAccountsOnDeviceBySegwit({ ...commonParams, isSegwit: true })

    const accounts = [...nonSegwitAccounts, ...segwitAccounts]

    return accounts
  })
}

export async function getWalletIdentifier({
  hwApp,
  isSegwit,
  currencyId,
  devicePath,
}: {
  hwApp: Object,
  isSegwit: boolean,
  currencyId: string,
  devicePath: string,
}): Promise<string> {
  const isVerify = false
  const deviceIdentifiers = await hwApp.getWalletPublicKey(devicePath, isVerify, isSegwit)
  const { publicKey } = deviceIdentifiers
  const WALLET_IDENTIFIER = `${publicKey}__${currencyId}${isSegwit ? '_segwit' : ''}`
  return WALLET_IDENTIFIER
}

async function scanAccountsOnDeviceBySegwit({
  hwApp,
  currencyId,
  onAccountScanned,
  devicePath,
  isSegwit,
}: {
  hwApp: Object,
  currencyId: string,
  onAccountScanned: AccountRaw => void,
  devicePath: string,
  isSegwit: boolean,
}): Promise<AccountRaw[]> {
  // compute wallet identifier
  const WALLET_IDENTIFIER = await getWalletIdentifier({ hwApp, isSegwit, currencyId, devicePath })

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

async function scanNextAccount(props: {
  // $FlowFixMe
  wallet: NJSWallet,
  hwApp: Object,
  currencyId: string,
  accountsCount: number,
  accountIndex: number,
  accounts: AccountRaw[],
  onAccountScanned: AccountRaw => void,
  isSegwit: boolean,
}): Promise<AccountRaw[]> {
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

  const isEmpty = ops.length === 0

  // trigger event
  onAccountScanned(account)

  accounts.push(account)

  // returns if the current index points on an account with no ops
  if (isEmpty) {
    return accounts
  }

  return scanNextAccount({ ...props, accountIndex: accountIndex + 1 })
}

async function getOrCreateWallet(
  WALLET_IDENTIFIER: string,
  currencyId: string,
  isSegwit: boolean,
): NJSWallet {
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
}): Promise<AccountRaw> {
  /*
  const balanceByDay = ops.length
    ? await getBalanceByDaySinceOperation({
        njsAccount,
        njsOperation: ops[0],
        core,
      })
    : {}
    */

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

  const addresses = rawAddresses.map(njsAddress => ({
    str: njsAddress.toString(),
    path: `${accountPath}/${njsAddress.getDerivationPath()}`,
  }))

  if (addresses.length === 0) {
    throw new Error('no addresses found')
  }

  const { str: freshAddress, path: freshAddressPath } = addresses[0]

  const operations = ops.map(op => buildOperationRaw({ core, op, xpub }))

  const rawAccount: AccountRaw = {
    id: xpub, // FIXME for account id you might want to prepend the crypto currency id to this because it's not gonna be unique.
    xpub,
    path: walletPath,
    name: `${operations.length === 0 ? 'New ' : ''}Account ${accountIndex}${
      isSegwit ? ' (segwit)' : ''
    }`, // TODO: placeholder name?
    isSegwit,
    freshAddress,
    freshAddressPath,
    balance,
    blockHeight,
    archived: false,
    index: accountIndex,
    operations,
    pendingOperations: [],
    currencyId,
    unitMagnitude: jsCurrency.units[0].magnitude,
    lastSyncDate: new Date().toISOString(),
  }

  return rawAccount
}

function buildOperationRaw({
  core,
  op,
  xpub,
}: {
  core: Object,
  op: NJSOperation,
  xpub: string,
}): OperationRaw {
  const id = op.getUid()
  const bitcoinLikeOperation = op.asBitcoinLikeOperation()
  const bitcoinLikeTransaction = bitcoinLikeOperation.getTransaction()
  const hash = bitcoinLikeTransaction.getHash()
  const operationType = op.getOperationType()
  const value = op.getAmount().toLong()

  const OperationTypeMap: { [_: $Keys<typeof core.OPERATION_TYPES>]: OperationType } = {
    [core.OPERATION_TYPES.SEND]: 'OUT',
    [core.OPERATION_TYPES.RECEIVE]: 'IN',
  }

  // if transaction is a send, amount becomes negative
  const type = OperationTypeMap[operationType]

  return {
    id,
    hash,
    type,
    value,
    senders: op.getSenders(),
    recipients: op.getRecipients(),
    blockHeight: op.getBlockHeight(),
    blockHash: null,
    accountId: xpub,
    date: op.getDate().toISOString(),
  }
}

/*
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

function areSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
*/

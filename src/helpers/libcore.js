// @flow

import logger from 'logger'
import Btc from '@ledgerhq/hw-app-btc'
import { withDevice } from 'helpers/deviceAccess'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

import type { AccountRaw, OperationRaw, OperationType } from '@ledgerhq/live-common/lib/types'
import type { NJSAccount, NJSOperation } from '@ledgerhq/ledger-core/src/ledgercore_doc'

import { isSegwitAccount } from 'helpers/bip32'
import * as accountIdHelper from 'helpers/accountId'
import createCustomErrorClass from './createCustomErrorClass'

import { getAccountPlaceholderName, getNewAccountPlaceholderName } from './accountName'

const NoAddressesFound = createCustomErrorClass('NoAddressesFound')

export function isValidAddress(core: *, currency: *, address: string): boolean {
  const addr = new core.NJSAddress(address, currency)
  return addr.isValid(address, currency)
}

type Props = {
  core: *,
  devicePath: string,
  currencyId: string,
  onAccountScanned: AccountRaw => void,
}

const { SHOW_LEGACY_NEW_ACCOUNT } = process.env

export function scanAccountsOnDevice(props: Props): Promise<AccountRaw[]> {
  const { devicePath, currencyId, onAccountScanned, core } = props
  const currency = getCryptoCurrencyById(currencyId)

  return withDevice(devicePath)(async transport => {
    const hwApp = new Btc(transport)

    const commonParams = {
      core,
      currencyId,
      onAccountScanned,
      hwApp,
    }

    let allAccounts = []

    const nonSegwitAccounts = await scanAccountsOnDeviceBySegwit({
      ...commonParams,
      showNewAccount: !!SHOW_LEGACY_NEW_ACCOUNT || !currency.supportsSegwit,
      isSegwit: false,
    })
    allAccounts = allAccounts.concat(nonSegwitAccounts)

    if (currency.supportsSegwit) {
      const segwitAccounts = await scanAccountsOnDeviceBySegwit({
        ...commonParams,
        showNewAccount: true,
        isSegwit: true,
      })
      allAccounts = allAccounts.concat(segwitAccounts)
    }

    return allAccounts
  })
}

function encodeWalletName({
  publicKey,
  currencyId,
  isSegwit,
}: {
  publicKey: string,
  currencyId: string,
  isSegwit: boolean,
}) {
  return `${publicKey}__${currencyId}${isSegwit ? '_segwit' : ''}`
}

async function scanAccountsOnDeviceBySegwit({
  core,
  hwApp,
  currencyId,
  onAccountScanned,
  isSegwit,
  showNewAccount,
}: {
  core: *,
  hwApp: Object,
  currencyId: string,
  onAccountScanned: AccountRaw => void,
  isSegwit: boolean, // FIXME all segwit to change to 'purpose'
  showNewAccount: boolean,
}): Promise<AccountRaw[]> {
  const { coinType } = getCryptoCurrencyById(currencyId)
  const { publicKey } = await hwApp.getWalletPublicKey(
    `${isSegwit ? '49' : '44'}'/${coinType}'`,
    false,
    isSegwit,
  )
  const walletName = encodeWalletName({ publicKey, currencyId, isSegwit })

  // retrieve or create the wallet
  const wallet = await getOrCreateWallet(core, walletName, currencyId, isSegwit)
  const accountsCount = await wallet.getAccountCount()

  // recursively scan all accounts on device on the given app
  // new accounts will be created in sqlite, existing ones will be updated
  const accounts = await scanNextAccount({
    core,
    wallet,
    hwApp,
    currencyId,
    accountsCount,
    accountIndex: 0,
    accounts: [],
    onAccountScanned,
    isSegwit,
    showNewAccount,
  })

  return accounts
}

async function scanNextAccount(props: {
  // $FlowFixMe
  wallet: NJSWallet,
  core: *,
  hwApp: Object,
  currencyId: string,
  accountsCount: number,
  accountIndex: number,
  accounts: AccountRaw[],
  onAccountScanned: AccountRaw => void,
  isSegwit: boolean,
  showNewAccount: boolean,
}): Promise<AccountRaw[]> {
  const {
    core,
    wallet,
    hwApp,
    currencyId,
    accountsCount,
    accountIndex,
    accounts,
    onAccountScanned,
    isSegwit,
    showNewAccount,
  } = props

  // create account only if account has not been scanned yet
  // if it has already been created, we just need to get it, and sync it
  const hasBeenScanned = accountIndex < accountsCount

  const njsAccount = hasBeenScanned
    ? await wallet.getAccount(accountIndex)
    : await core.createAccount(wallet, hwApp)

  const shouldSyncAccount = true // TODO: let's sync everytime. maybe in the future we can optimize.
  if (shouldSyncAccount) {
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
    ops,
  })

  const isEmpty = ops.length === 0

  if (!isEmpty || showNewAccount) {
    onAccountScanned(account)
    accounts.push(account)
  }

  // returns if the current index points on an account with no ops
  if (isEmpty) {
    return accounts
  }

  return scanNextAccount({ ...props, accountIndex: accountIndex + 1 })
}

async function getOrCreateWallet(
  core: *,
  WALLET_IDENTIFIER: string,
  currencyId: string,
  isSegwit: boolean,
): NJSWallet {
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
  accountIndex,
  ops,
}: {
  njsAccount: NJSAccount,
  isSegwit: boolean,
  wallet: NJSWallet,
  currencyId: string,
  accountIndex: number,
  core: *,
  ops: NJSOperation[],
}): Promise<AccountRaw> {
  const njsBalance = await njsAccount.getBalance()
  const balance = njsBalance.toLong()

  const jsCurrency = getCryptoCurrencyById(currencyId)
  const { derivations } = await wallet.getAccountCreationInfo(accountIndex)
  const [walletPath, accountPath] = derivations

  // retrieve xpub
  const xpub = njsAccount.getRestoreKey()

  // blockHeight
  const { height: blockHeight } = await njsAccount.getLastBlock()

  // get a bunch of fresh addresses
  const rawAddresses = await njsAccount.getFreshPublicAddresses()

  const addresses = rawAddresses.map(njsAddress => ({
    str: njsAddress.toString(),
    path: `${accountPath}/${njsAddress.getDerivationPath()}`,
  }))

  if (addresses.length === 0) {
    throw new NoAddressesFound()
  }

  const { str: freshAddress, path: freshAddressPath } = addresses[0]

  ops.sort((a, b) => b.getDate() - a.getDate())

  const operations = ops.map(op => buildOperationRaw({ core, op, xpub }))
  const currency = getCryptoCurrencyById(currencyId)

  const name =
    operations.length === 0
      ? getNewAccountPlaceholderName(currency, accountIndex)
      : getAccountPlaceholderName(
          currency,
          accountIndex,
          (currency.supportsSegwit && !isSegwit) || false,
        )

  const rawAccount: AccountRaw = {
    id: accountIdHelper.encode({
      type: 'libcore',
      version: '1',
      xpub,
      walletName: wallet.getName(),
    }),
    xpub,
    path: walletPath,
    name,
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
  core: *,
  op: NJSOperation,
  xpub: string,
}): OperationRaw {
  const id = op.getUid()
  const bitcoinLikeOperation = op.asBitcoinLikeOperation()
  const bitcoinLikeTransaction = bitcoinLikeOperation.getTransaction()
  const hash = bitcoinLikeTransaction.getHash()
  const operationType = op.getOperationType()
  const value = op.getAmount().toLong()
  const fee = op.getFees().toLong()

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
    fee,
    senders: op.getSenders(),
    recipients: op.getRecipients(),
    blockHeight: op.getBlockHeight(),
    blockHash: null,
    accountId: xpub,
    date: op.getDate().toISOString(),
  }
}

export async function getNJSAccount({
  accountRaw,
  njsWalletPool,
}: {
  accountRaw: AccountRaw,
  njsWalletPool: *,
}) {
  const decodedAccountId = accountIdHelper.decode(accountRaw.id)
  const njsWallet = await njsWalletPool.getWallet(decodedAccountId.walletName)
  const njsAccount = await njsWallet.getAccount(accountRaw.index)
  return njsAccount
}

export async function syncAccount({
  rawAccount,
  core,
  njsWalletPool,
}: {
  core: *,
  rawAccount: AccountRaw,
  njsWalletPool: *,
}) {
  const decodedAccountId = accountIdHelper.decode(rawAccount.id)
  const njsWallet = await njsWalletPool.getWallet(decodedAccountId.walletName)
  const njsAccount = await njsWallet.getAccount(rawAccount.index)

  const unsub = await core.syncAccount(njsAccount)
  unsub()

  const query = njsAccount.queryOperations()
  const ops = await query.complete().execute()
  const njsBalance = await njsAccount.getBalance()

  const syncedRawAccount = await buildAccountRaw({
    njsAccount,
    isSegwit: isSegwitAccount(rawAccount),
    accountIndex: rawAccount.index,
    wallet: njsWallet,
    currencyId: rawAccount.currencyId,
    core,
    ops,
  })

  syncedRawAccount.balance = njsBalance.toLong()

  logger.log(`Synced account [${syncedRawAccount.name}]: ${syncedRawAccount.balance}`)

  return syncedRawAccount
}

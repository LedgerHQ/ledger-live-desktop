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
  core: Object,
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
      hwApp,
      currencyId,
      onAccountScanned,
      devicePath,
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
  core,
  hwApp,
  currencyId,
  onAccountScanned,
  devicePath,
  isSegwit,
  showNewAccount,
}: {
  hwApp: Object,
  currencyId: string,
  onAccountScanned: AccountRaw => void,
  devicePath: string,
  isSegwit: boolean,
  showNewAccount: boolean,
}): Promise<AccountRaw[]> {
  // compute wallet identifier
  const WALLET_IDENTIFIER = await getWalletIdentifier({ hwApp, isSegwit, currencyId, devicePath })

  // retrieve or create the wallet
  const wallet = await getOrCreateWallet(core, WALLET_IDENTIFIER, currencyId, isSegwit)
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
  core: Object,
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

  console.log(`>> Scanning account ${accountIndex} - isSegwit: ${isSegwit.toString()}`) // eslint-disable-line no-console

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
  core: Object,
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
  // $FlowFixMe
  wallet: NJSWallet,
  currencyId: string,
  accountIndex: number,
  core: Object,
  hwApp: Object,
  // $FlowFixMe
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
    throw new Error('no addresses found')
  }

  const { str: freshAddress, path: freshAddressPath } = addresses[0]

  const operations = ops.map(op => buildOperationRaw({ core, op, xpub }))
  const currency = getCryptoCurrencyById(currencyId)

  let name = operations.length === 0 ? `New Account` : `Account ${accountIndex}`
  if (currency.supportsSegwit && !isSegwit) {
    name += ' (legacy)'
  }

  const rawAccount: AccountRaw = {
    id: xpub, // FIXME for account id you might want to prepend the crypto currency id to this because it's not gonna be unique.
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

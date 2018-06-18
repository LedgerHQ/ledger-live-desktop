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

const hexToBytes = str => Array.from(Buffer.from(str, 'hex'))

const createAccount = async (wallet, hwApp) => {
  const accountCreationInfos = await wallet.getNextAccountCreationInfo()
  await accountCreationInfos.derivations.reduce(
    (promise, derivation) =>
      promise.then(async () => {
        const { publicKey, chainCode } = await hwApp.getWalletPublicKey(derivation)
        accountCreationInfos.publicKeys.push(hexToBytes(publicKey))
        accountCreationInfos.chainCodes.push(hexToBytes(chainCode))
      }),
    Promise.resolve(),
  )
  return wallet.newAccountWithInfo(accountCreationInfos)
}

function createEventReceiver(core, cb) {
  return new core.NJSEventReceiver({
    onEvent: event => cb(event),
  })
}

function subscribeToEventBus(core, eventBus, receiver) {
  eventBus.subscribe(core.getSerialExecutionContext('main'), receiver)
}

const coreSyncAccount = (core, account) =>
  new Promise((resolve, reject) => {
    const eventReceiver = createEventReceiver(core, e => {
      const code = e.getCode()
      if (code === core.EVENT_CODE.UNDEFINED || code === core.EVENT_CODE.SYNCHRONIZATION_FAILED) {
        const payload = e.getPayload()
        const message = (
          (payload && payload.getString('EV_SYNC_ERROR_MESSAGE')) ||
          'Sync failed'
        ).replace(' (EC_PRIV_KEY_INVALID_FORMAT)', '')
        reject(new Error(message))
        return
      }
      if (
        code === core.EVENT_CODE.SYNCHRONIZATION_SUCCEED ||
        code === core.EVENT_CODE.SYNCHRONIZATION_SUCCEED_ON_PREVIOUSLY_EMPTY_ACCOUNT
      ) {
        resolve(() => {
          eventBus.unsubscribe(eventReceiver)
        })
      }
    })
    const eventBus = account.synchronize()
    subscribeToEventBus(core, eventBus, eventReceiver)
  })

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
    : await createAccount(wallet, hwApp)

  const shouldSyncAccount = true // TODO: let's sync everytime. maybe in the future we can optimize.
  if (shouldSyncAccount) {
    await coreSyncAccount(core, njsAccount)
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

const createWalletConfig = (core, configMap = {}) => {
  const config = new core.NJSDynamicObject()
  for (const i in configMap) {
    if (configMap.hasOwnProperty(i)) {
      config.putString(i, configMap[i])
    }
  }
  return config
}

async function getOrCreateWallet(
  core: *,
  WALLET_IDENTIFIER: string,
  currencyId: string,
  isSegwit: boolean,
): NJSWallet {
  const pool = core.getPoolInstance()
  try {
    const wallet = await pool.getWallet(WALLET_IDENTIFIER)
    return wallet
  } catch (err) {
    const currency = await pool.getCurrency(currencyId)
    const walletConfig = isSegwit
      ? {
          KEYCHAIN_ENGINE: 'BIP49_P2SH',
          KEYCHAIN_DERIVATION_SCHEME: "49'/<coin_type>'/<account>'/<node>/<address>",
        }
      : undefined
    const njsWalletConfig = createWalletConfig(core, walletConfig)
    const wallet = await core
      .getPoolInstance()
      .createWallet(WALLET_IDENTIFIER, currency, njsWalletConfig)
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
  let value = op.getAmount().toLong()
  const fee = op.getFees().toLong()

  const OperationTypeMap: { [_: $Keys<typeof core.OPERATION_TYPES>]: OperationType } = {
    [core.OPERATION_TYPES.SEND]: 'OUT',
    [core.OPERATION_TYPES.RECEIVE]: 'IN',
  }

  // if transaction is a send, amount becomes negative
  const type = OperationTypeMap[operationType]

  if (type === 'OUT') {
    value += fee
  }

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

export async function syncAccount({ rawAccount, core }: { core: *, rawAccount: AccountRaw }) {
  const decodedAccountId = accountIdHelper.decode(rawAccount.id)
  const njsWallet = await core.getPoolInstance().getWallet(decodedAccountId.walletName)
  const njsAccount = await njsWallet.getAccount(rawAccount.index)

  const unsub = await coreSyncAccount(core, njsAccount)
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

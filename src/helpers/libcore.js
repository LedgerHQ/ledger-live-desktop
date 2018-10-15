// @flow

// TODO split these into many files

import logger from 'logger'
import { BigNumber } from 'bignumber.js'
import Btc from '@ledgerhq/hw-app-btc'
import getAddressForCurrency from 'helpers/getAddressForCurrency'
import { withDevice } from 'helpers/deviceAccess'
import {
  getDerivationModesForCurrency,
  getDerivationScheme,
  isSegwitDerivationMode,
  isUnsplitDerivationMode,
  runDerivationScheme,
} from '@ledgerhq/live-common/lib/derivation'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import {
  encodeAccountId,
  getNewAccountPlaceholderName,
  getAccountPlaceholderName,
  getWalletName,
} from '@ledgerhq/live-common/lib/account'
import { SHOW_LEGACY_NEW_ACCOUNT, SYNC_TIMEOUT } from 'config/constants'

import type {
  CryptoCurrency,
  AccountRaw,
  OperationRaw,
  OperationType,
} from '@ledgerhq/live-common/lib/types'
import type { NJSAccount, NJSOperation } from '@ledgerhq/ledger-core/src/ledgercore_doc'

import { NoAddressesFound } from 'config/errors'
import { deserializeError } from './errors'
import { timeoutTagged } from './promise'

export function isValidAddress(core: *, currency: *, address: string): boolean {
  const addr = new core.NJSAddress(address, currency)
  return addr.isValid(address, currency)
}

type Props = {
  core: *,
  devicePath: string,
  currencyId: string,
  onAccountScanned: AccountRaw => void,
  isUnsubscribed: () => boolean,
}

const shouldShowNewAccount = (currency, derivationMode) =>
  derivationMode === ''
    ? !!SHOW_LEGACY_NEW_ACCOUNT || !currency.supportsSegwit
    : derivationMode === 'segwit'

export async function scanAccountsOnDevice(props: Props): Promise<AccountRaw[]> {
  const { devicePath, currencyId, onAccountScanned, core, isUnsubscribed } = props
  const currency = getCryptoCurrencyById(currencyId)

  let allAccounts = []

  const derivationModes = getDerivationModesForCurrency(currency)

  for (let i = 0; i < derivationModes.length; i++) {
    const derivationMode = derivationModes[i]
    const accounts = await scanAccountsOnDeviceBySegwit({
      core,
      currency,
      onAccountScanned,
      devicePath,
      isUnsubscribed,
      showNewAccount: shouldShowNewAccount(currency, derivationMode),
      derivationMode,
    })
    allAccounts = allAccounts.concat(accounts)
  }

  return allAccounts
}

async function scanAccountsOnDeviceBySegwit({
  core,
  devicePath,
  currency,
  onAccountScanned,
  isUnsubscribed,
  derivationMode,
  showNewAccount,
}: {
  core: *,
  devicePath: string,
  currency: CryptoCurrency,
  onAccountScanned: AccountRaw => void,
  isUnsubscribed: () => boolean,
  derivationMode: string,
  showNewAccount: boolean,
}): Promise<AccountRaw[]> {
  const isSegwit = isSegwitDerivationMode(derivationMode)
  const unsplitFork = isUnsplitDerivationMode(derivationMode) ? currency.forkedFrom : null
  const { coinType } = unsplitFork ? getCryptoCurrencyById(unsplitFork) : currency
  const path = `${isSegwit ? '49' : '44'}'/${coinType}'`

  let seedIdentifier
  if (currency.family === 'ethereum') {
    const { address } = await withDevice(devicePath)(async transport =>
      getAddressForCurrency(transport, getCryptoCurrencyById(currency.id), path),
    )
    seedIdentifier = address
  } else {
    const { publicKey } = await withDevice(devicePath)(async transport =>
      new Btc(transport).getWalletPublicKey(path, false, isSegwit),
    )
    seedIdentifier = publicKey
  }

  if (isUnsubscribed()) return []

  const walletName = getWalletName({
    seedIdentifier,
    currency,
    derivationMode,
  })

  // retrieve or create the wallet
  const wallet = await getOrCreateWallet(core, walletName, { currency, derivationMode })

  // recursively scan all accounts on device on the given app
  // new accounts will be created in sqlite, existing ones will be updated
  const accounts = await scanNextAccount({
    core,
    wallet,
    walletName,
    devicePath,
    currency,
    accountIndex: 0,
    accounts: [],
    onAccountScanned,
    seedIdentifier,
    derivationMode,
    showNewAccount,
    isUnsubscribed,
  })

  return accounts
}

const hexToBytes = str => Array.from(Buffer.from(str, 'hex'))

const createAccount = async (wallet, devicePath, currency) => {
  let accountCreationInfos
  if (currency.family === 'ethereum') {
  } else {
    accountCreationInfos = await wallet.getNextAccountCreationInfo()
    await accountCreationInfos.derivations.reduce(
      (promise, derivation) =>
        promise.then(async () => {
          const { publicKey, chainCode } = await withDevice(devicePath)(async transport =>
            new Btc(transport).getWalletPublicKey(derivation),
          )
          accountCreationInfos.publicKeys.push(hexToBytes(publicKey))
          accountCreationInfos.chainCodes.push(hexToBytes(chainCode))
        }),
      Promise.resolve(),
    )
  }
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
      logger.debug(`syncAccountEvent ${code}`, { type: 'libcore-sync' })
      if (code === core.EVENT_CODE.UNDEFINED || code === core.EVENT_CODE.SYNCHRONIZATION_FAILED) {
        const payload = e.getPayload()
        const message = (
          (payload && payload.getString('EV_SYNC_ERROR_MESSAGE')) ||
          'Sync failed'
        ).replace(' (EC_PRIV_KEY_INVALID_FORMAT)', '')
        try {
          reject(deserializeError(JSON.parse(message)))
        } catch (e) {
          reject(message)
        }
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
  walletName: string,
  core: *,
  devicePath: string,
  currency: CryptoCurrency,
  seedIdentifier: string,
  derivationMode: string,
  accountIndex: number,
  accounts: AccountRaw[],
  onAccountScanned: AccountRaw => void,
  showNewAccount: boolean,
  isUnsubscribed: () => boolean,
}): Promise<AccountRaw[]> {
  const {
    core,
    wallet,
    walletName,
    devicePath,
    currency,
    accountIndex,
    accounts,
    onAccountScanned,
    derivationMode,
    seedIdentifier,
    showNewAccount,
    isUnsubscribed,
  } = props

  await syncAccount({
    core,
    devicePath,
    derivationMode,
    seedIdentifier,
    currency,
    index: accountIndex,
  })
  if (isUnsubscribed()) return []

  const njsAccount = await wallet.getAccount(accountIndex)
  if (isUnsubscribed()) return []

  const query = njsAccount.queryOperations()
  const ops = await query.complete().execute()
  if (isUnsubscribed()) return []

  // ERC20
  // if (currency.family === 'ethereum') {
  //   const ethAccount = njsAccount.asEthereumLikeAccount()
  //   const erc20Accounts = await ethAccount.getERC20Accounts()
  //   const enriched = erc20Accounts.map(erc20account => ({
  //     balance: erc20account.getBalance().toString(10),
  //     token: erc20account.getToken().name,
  //     contractAddress: erc20account.contractAddress(),
  //   }))
  // }

  const account = await buildAccountRaw({
    njsAccount,
    seedIdentifier,
    derivationMode,
    accountIndex,
    wallet,
    walletName,
    currency,
    core,
    ops,
  })
  if (isUnsubscribed()) return []

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

export async function getOrCreateWallet(
  core: *,
  walletName: string,
  {
    currency,
    derivationMode,
  }: {
    currency: CryptoCurrency,
    derivationMode: string,
  },
): NJSWallet {
  const pool = core.getPoolInstance()
  try {
    const wallet = await timeoutTagged('getWallet', 5000, pool.getWallet(walletName))
    return wallet
  } catch (err) {
    const currencyCore = await timeoutTagged('getCurrency', 5000, pool.getCurrency(currency.id))
    const derivationScheme = getDerivationScheme({ currency, derivationMode })
    const walletConfig = isSegwitDerivationMode(derivationMode)
      ? {
          KEYCHAIN_ENGINE: 'BIP49_P2SH',
          KEYCHAIN_DERIVATION_SCHEME: derivationScheme,
        }
      : {
          KEYCHAIN_DERIVATION_SCHEME: derivationScheme,
        }
    if (currency.family === 'ethereum') {
      // New API not reachable outside of Ledger !!!
      // walletConfig.BLOCKCHAIN_EXPLORER_API_ENDPOINT = 'http://18.202.239.45:20000'
      walletConfig.BLOCKCHAIN_EXPLORER_VERSION = 'v2'
    }
    const njsWalletConfig = createWalletConfig(core, walletConfig)
    // const libcoreCurrency = currency.id === 'ethereum' ? 'ethereum_ropstein' : currencyCore
    const wallet = await timeoutTagged(
      'createWallet',
      10000,
      core.getPoolInstance().createWallet(walletName, currencyCore, njsWalletConfig),
    )
    return wallet
  }
}

async function buildAccountRaw({
  njsAccount,
  seedIdentifier,
  derivationMode,
  wallet,
  currency,
  core,
  accountIndex,
  ops,
}: {
  njsAccount: NJSAccount,
  wallet: NJSWallet,
  seedIdentifier: string,
  walletName: string,
  currency: CryptoCurrency,
  derivationMode: string,
  accountIndex: number,
  core: *,
  ops: NJSOperation[],
}): Promise<AccountRaw> {
  const njsBalance = await timeoutTagged('getBalance', 10000, njsAccount.getBalance())
  const balance = njsBalance.toLong()

  const { derivations } = await timeoutTagged(
    'getAccountCreationInfo',
    10000,
    wallet.getAccountCreationInfo(accountIndex),
  )
  const [walletPath, accountPath] = derivations

  // retrieve xpub
  const xpub = njsAccount.getRestoreKey()

  // blockHeight
  const { height: blockHeight } = await timeoutTagged(
    'getLastBlock',
    30000,
    njsAccount.getLastBlock(),
  )

  // get a bunch of fresh addresses
  const rawAddresses = await timeoutTagged(
    'getFreshPublicAddresses',
    10000,
    njsAccount.getFreshPublicAddresses(),
  )

  const addresses = rawAddresses.map(njsAddress => ({
    str: njsAddress.toString(),
    path: `${accountPath}/${njsAddress.getDerivationPath()}`,
  }))

  if (addresses.length === 0) {
    throw new NoAddressesFound()
  }

  const { str: freshAddress, path: freshAddressPath } = addresses[0]

  ops.sort((a, b) => b.getDate() - a.getDate())

  const operations = ops.map(op => buildOperationRaw({ core, op, xpub, currency }))

  const name =
    operations.length === 0
      ? getNewAccountPlaceholderName({ currency, index: accountIndex, derivationMode })
      : getAccountPlaceholderName({
          currency,
          index: accountIndex,
          derivationMode,
        })

  const rawAccount: AccountRaw = {
    id: encodeAccountId({
      type: 'libcore',
      version: '1',
      currencyId: currency.id,
      xpubOrAddress: xpub,
      derivationMode,
    }),
    seedIdentifier,
    derivationMode,
    xpub,
    path: walletPath,
    name,
    freshAddress,
    freshAddressPath,
    balance,
    blockHeight,
    archived: false,
    index: accountIndex,
    operations,
    pendingOperations: [],
    currencyId: currency.id,
    unitMagnitude: currency.units[0].magnitude,
    lastSyncDate: new Date().toISOString(),
  }

  return rawAccount
}

function buildOperationRaw({
  core,
  op,
  xpub,
  currency,
}: {
  core: *,
  op: NJSOperation,
  xpub: string,
  currency: CryptoCurrency,
}): OperationRaw {
  const operationType = op.getOperationType()

  const OperationTypeMap: { [_: $Keys<typeof core.OPERATION_TYPES>]: OperationType } = {
    [core.OPERATION_TYPES.SEND]: 'OUT',
    [core.OPERATION_TYPES.RECEIVE]: 'IN',
  }

  // if transaction is a send, amount becomes negative
  const type = OperationTypeMap[operationType]

  // ETHEREUM OPERATION
  if (currency.family === 'ethereum') {
    const ethereumLikeOperation = op.asEthereumLikeOperation()
    const ethereumLikeTransaction = ethereumLikeOperation.getTransaction()
    const hash = ethereumLikeTransaction.getHash()
    const gasPrice = ethereumLikeTransaction.getGasPrice().toString()
    const gasLimit = ethereumLikeTransaction.getGasLimit().toString()
    let value = BigNumber(op.getAmount().toString())
    const fee = BigNumber(gasPrice).times(gasLimit)
    if (type === 'OUT') {
      value = value.plus(fee)
    }
    const id = `${xpub}-${hash}-${type}`
    return {
      id,
      hash,
      type,
      value,
      fee,
      senders: type === 'IN' ? [ethereumLikeTransaction.getSender().toEIP55()] : [xpub],
      recipients: type === 'IN' ? [xpub] : [ethereumLikeTransaction.getReceiver().toEIP55()],
      blockHeight: op.getBlockHeight(), // TODO can we put something?
      blockHash: null,
      accountId: xpub, // FIXME accountId: xpub  !?
      date: op.getDate().toISOString(),
    }
  }

  const bitcoinLikeOperation = op.asBitcoinLikeOperation()
  const bitcoinLikeTransaction = bitcoinLikeOperation.getTransaction()
  const hash = bitcoinLikeTransaction.getHash()
  let value = op.getAmount().toLong()
  const fee = op.getFees().toLong()

  if (type === 'OUT') {
    value += fee
  }

  const id = `${xpub}-${hash}-${type}`

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
    accountId: xpub, // FIXME accountId: xpub  !?
    date: op.getDate().toISOString(),
  }
}

export async function syncAccount({
  core,
  xpub,
  devicePath,
  derivationMode,
  seedIdentifier,
  currency,
  index,
}: {
  core: *,
  xpub?: string,
  devicePath?: string,
  derivationMode: string,
  seedIdentifier: string,
  currency: CryptoCurrency,
  index: number,
}) {
  const walletName = getWalletName({
    seedIdentifier,
    derivationMode,
    currency,
  })
  const njsWallet = await getOrCreateWallet(core, walletName, { currency, derivationMode })

  let njsAccount
  let requiresCacheFlush = false

  try {
    njsAccount = await timeoutTagged('getAccount', 10000, njsWallet.getAccount(index))
  } catch (e) {
    requiresCacheFlush = true
    logger.warn(`Have to recreate the account... (${e.message})`)
    if (xpub) {
      const extendedInfos = await timeoutTagged(
        'getEKACI',
        10000,
        njsWallet.getExtendedKeyAccountCreationInfo(index),
      )
      extendedInfos.extendedKeys.push(xpub)
      njsAccount = await timeoutTagged(
        'newAWEKI',
        10000,
        njsWallet.newAccountWithExtendedKeyInfo(extendedInfos),
      )
    } else if (devicePath) {
      if (currency.family === 'ethereum') {
        // TODO: factorize with other usage
        const isSegwit = isSegwitDerivationMode(derivationMode)
        const unsplitFork = isUnsplitDerivationMode(derivationMode) ? currency.forkedFrom : null
        const { coinType } = unsplitFork ? getCryptoCurrencyById(unsplitFork) : currency
        const path = `${isSegwit ? '49' : '44'}'/${coinType}'`

        // for now we always use index 0 for account
        const derivationScheme = getDerivationScheme({ currency, derivationMode })
        const accountPath = runDerivationScheme(derivationScheme, currency, { account: index })

        const { address } = await withDevice(devicePath)(async transport =>
          getAddressForCurrency(transport, getCryptoCurrencyById(currency.id), accountPath),
        )

        const extendedInfos = {
          index,
          owners: ['main'],
          derivations: [path, accountPath],
          extendedKeys: [address],
        }

        njsAccount = await njsWallet.newAccountWithExtendedKeyInfo(extendedInfos)
      } else {
        const accountCreationInfos = await njsWallet.getNextAccountCreationInfo()
        await accountCreationInfos.derivations.reduce(
          (promise, derivation) =>
            promise.then(async () => {
              const { publicKey, chainCode } = await withDevice(devicePath)(async transport =>
                new Btc(transport).getWalletPublicKey(derivation),
              )
              accountCreationInfos.publicKeys.push(hexToBytes(publicKey))
              accountCreationInfos.chainCodes.push(hexToBytes(chainCode))
            }),
          Promise.resolve(),
        )
        njsAccount = await njsWallet.newAccountWithInfo(accountCreationInfos)
      }
    } else {
      throw new Error('Cant re-create the account. Are you mad?')
    }
  }

  const unsub = await coreSyncAccount(core, njsAccount)
  unsub()

  const query = njsAccount.queryOperations()
  const ops = await timeoutTagged('ops', SYNC_TIMEOUT, query.complete().execute())
  const njsBalance = await timeoutTagged('getBalance', 10000, njsAccount.getBalance())

  const syncedRawAccount = await buildAccountRaw({
    njsAccount,
    derivationMode,
    seedIdentifier,
    accountIndex: index,
    wallet: njsWallet,
    walletName,
    currency,
    core,
    ops,
  })

  syncedRawAccount.balance = njsBalance.toLong()

  logger.log(`Synced account [${syncedRawAccount.name}]: ${syncedRawAccount.balance}`)

  return { rawAccount: syncedRawAccount, requiresCacheFlush }
}

export function libcoreAmountToBigNumber(njsAmount: *): BigNumber {
  return BigNumber(njsAmount.toBigInt().toString(10))
}

export function bigNumberToLibcoreAmount(core: *, njsWalletCurrency: *, bigNumber: BigNumber) {
  return new core.NJSAmount(njsWalletCurrency, 0).fromHex(njsWalletCurrency, bigNumber.toString(16))
}

export async function scanAccountsFromXPUB({
  core,
  currencyId,
  xpub,
  derivationMode,
  seedIdentifier,
}: {
  core: *,
  currencyId: string,
  xpub: string,
  derivationMode: string,
  seedIdentifier: string,
}) {
  const currency = getCryptoCurrencyById(currencyId)
  const walletName = getWalletName({
    currency,
    seedIdentifier: 'debug',
    derivationMode,
  })

  const wallet = await getOrCreateWallet(core, walletName, { currency, derivationMode })

  await wallet.eraseDataSince(new Date(0))

  const index = 0

  const isSegwit = isSegwitDerivationMode(derivationMode)

  const extendedInfos = {
    index,
    owners: ['main'],
    derivations: [
      `${isSegwit ? '49' : '44'}'/${currency.coinType}'`,
      `${isSegwit ? '49' : '44'}'/${currency.coinType}'/0`,
    ],
    extendedKeys: [xpub],
  }

  const account = await wallet.newAccountWithExtendedKeyInfo(extendedInfos)
  await coreSyncAccount(core, account)
  const query = account.queryOperations()
  const ops = await query.complete().execute()
  const rawAccount = await buildAccountRaw({
    njsAccount: account,
    derivationMode,
    seedIdentifier,
    accountIndex: index,
    wallet,
    walletName,
    currency,
    core,
    ops,
  })

  return rawAccount
}

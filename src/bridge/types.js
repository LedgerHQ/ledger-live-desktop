// @flow

import type { Account, Operation, Currency } from '@ledgerhq/live-common/lib/types'

// a WalletBridge is implemented on renderer side.
// this is an abstraction on top of libcore / ethereumjs / ripple js / ...
// that would directly be called from UI needs.

export type DeviceId = string // for now it's just usb path

export type Observer<T> = {
  next: T => void,
  complete: () => void,
  error: (?Error) => void,
}

export type Subscription = {
  +unsubscribe: () => void,
}

export type EditProps<Transaction> = {
  account: Account,
  value: Transaction,
  onChange: Transaction => void,
}

export interface WalletBridge<Transaction> {
  // in "import"/"recover" step, we need a way to scan all accounts from the device
  // for a given currency.
  // deviceId currently is the device path.
  // observer is an Observer of Account object. Account are expected to be `archived` by default because we want to import all and opt-in on what account to use.
  // the scan can stop once all accounts are discovered.
  // the function returns a Subscription and you MUST stop everything if it is unsubscribed.
  scanAccountsOnDevice(
    currency: Currency,
    deviceId: DeviceId,
    observer: Observer<Account>,
  ): Subscription;

  // synchronize an account. meaning updating the account object with latest state.
  // function receives the initialAccount object so you can actually know what the user side currently have
  // then you must emit one or more updater functions to inform data changes.
  // an update function is just a Account => Account that perform the changes (to avoid race condition issues)
  // this can emit new version of the account. typically these field can change over time:
  // operations if there are new ones (prepended), balance, blockHeight, ...
  // the synchronize can stop once everything is up to date. it is the user side responsability to start it again.
  // we should be able to interrupt the Subscription but we'll leave this usecase for later. if you don't support interruption, please `console.warn`
  synchronize(initialAccount: Account, observer: Observer<(Account) => Account>): Subscription;

  // for a given account, UI wants to load more operations in the account.operations
  // if you can't do it or there is no more things to load, just return account,
  // otherwise return (asynchronously) an account updater that add operations in account.operations
  // count is user's desired number of ops to pull (but implementation can decide to ignore it or not)
  pullMoreOperations(initialAccount: Account, count: number): Promise<(Account) => Account>;

  isRecipientValid(currency: Currency, recipient: string): Promise<boolean>;

  // Related to send funds:

  // a Transaction object is a black box that can be improved by the following methods & components...
  // IMPORTANT: this is only a temporary object on UI side! not on libcore side
  // underlying implementation can have the same concept too, the point is we need sync api for the UI
  // if you have async api under the hood, you will have to cache things and return tmp values..

  createTransaction(account: Account): Transaction;

  editTransactionAmount(account: Account, transaction: Transaction, amount: number): Transaction;

  getTransactionAmount(account: Account, transaction: Transaction): number;

  editTransactionRecipient(
    account: Account,
    transaction: Transaction,
    recipient: string,
  ): Transaction;

  getTransactionRecipient(account: Account, transaction: Transaction): string;

  isValidTransaction(account: Account, transaction: Transaction): boolean;

  // render the whole Fees section of the form
  EditFees?: *; // React$ComponentType<EditProps<Transaction>>;

  // render the whole advanced part of the form
  EditAdvancedOptions?: *; // React$ComponentType<EditProps<Transaction>>;

  canBeSpent(account: Account, transaction: Transaction): Promise<boolean>;

  getTotalSpent(account: Account, transaction: Transaction): Promise<number>;

  // NB this is not used yet but we'll use it when we have MAX
  getMaxAmount(account: Account, transaction: Transaction): Promise<number>;

  /**
   * finalize the transaction by
   * - signing it with the ledger device
   * - broadcasting it to network
   * - retrieve and return the optimistic Operation that this transaction is likely to create in the future
   *
   * NOTE: in future, when transaction balance is close to account.balance, we could wipe it all at this level...
   * to implement that, we might want to have special logic `account.balance-transaction.amount < dust` but not sure where this should leave (i would say on UI side because we need to inform user visually).
   */
  signAndBroadcast(
    account: Account,
    transaction: Transaction,
    deviceId: DeviceId,
  ): Promise<Operation>;

  // Implement an optimistic response for signAndBroadcast.
  // you likely should add the operation in account.pendingOperations but maybe you want to clean it (because maybe some are replaced / cancelled by this one?)
  addPendingOperation?: (account: Account, optimisticOperation: Operation) => Account;
}

// @flow

import type { Unit, Currency } from '@ledgerhq/currencies'

export type Device = {
  vendorId: string,
  productId: string,
  path: string,
}

export type Devices = Array<Device>

// -------------------- Transactions

export type Transaction = {
  account?: Account,
  address: string,
  balance: number,
  hash: string,
  receivedAt: string,
  confirmations: number,
}

export type Transactions = Array<Transaction>

// -------------------- Accounts

export type AccountSettings = {
  minConfirmations: number,
}

export type Account = {
  address: string,
  addresses: Array<string>,
  archived?: boolean,
  balance: number,
  balanceByDay: Object,
  coinType: number,
  currency: Currency,
  id: string,
  index: number,
  name: string,
  path: string,
  rootPath: string,
  transactions: Transactions,
  unit: Unit,
  settings: AccountSettings,
}

export type Accounts = Array<Account>

// -------------------- Settings

export type SettingsProfile = {
  password: {
    state: boolean,
    value: string,
  },
}
export type SettingsDisplay = {
  language: string,
}
export type SettingsMoney = {
  counterValue: string,
}
export type Settings = SettingsProfile & SettingsDisplay & SettingsMoney

export type T = (string, ?Object) => string

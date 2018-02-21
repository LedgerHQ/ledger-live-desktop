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
}

// -------------------- Accounts

export type Account = {
  address: string,
  addresses: Array<string>,
  archived?: boolean,
  balance: number,
  coinType: number,
  currency: Currency,
  id: string,
  index: number,
  name: string,
  path: string,
  transactions: Array<Transaction>,
  unit: Unit,
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
  orderAccounts: string,
}
export type Settings = SettingsProfile & SettingsDisplay

export type T = (string, ?Object) => string

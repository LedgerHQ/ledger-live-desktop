// @flow

export type Device = {
  vendorId: string,
  productId: string,
  path: string,
}

export type Devices = Array<Device>

// -------------------- Transactions

export type Transaction = {
  account?: Object,
  balance: number,
  hash: string,
  received_at: string,
}

// -------------------- Accounts

export type AccountData = {
  address: string,
  balance: number,
  currentIndex: number,
  path: string,
  transactions: Array<Transaction>,
}

export type Account = {
  archived?: boolean,
  data?: AccountData,
  id: string,
  name: string,
  type: string,
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

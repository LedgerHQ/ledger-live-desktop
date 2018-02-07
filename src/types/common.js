// @flow

export type Device = {
  vendorId: string,
  productId: string,
  path: string,
}

export type Devices = Array<Device>

// -------------------- Transactions

export type Transaction = {
  balance: number,
  hash: string,
  received_at: string,
}

// -------------------- Accounts

export type AccountData = {
  address: string,
  balance: number,
  currentIndex: number,
  transactions: Array<Transaction>,
}

export type Account = {
  id: string,
  archived?: boolean,
  name: string,
  type: string,
  data?: AccountData,
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
export type Settings = SettingsProfile & SettingsDisplay

export type T = (string, ?Object) => string

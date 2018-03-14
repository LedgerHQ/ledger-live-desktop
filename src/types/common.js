// @flow

import type { Unit, Currency } from '@ledgerhq/currencies'

export type Device = {
  vendorId: string,
  productId: string,
  path: string,
}

export type Devices = Array<Device>

// -------------------- Operations

export type Operation = {
  id: string,
  account?: Account,
  address: string,
  amount: number,
  hash: string,
  receivedAt: string,
  confirmations: number,
}

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
  operations: Operation[],
  unit: Unit,
  settings: AccountSettings,
}

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

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
}

// -------------------- Accounts

export type AccountData = {
  address: string,
  balance: number,
  transactions: Array<Transaction>,
}

export type Account = {
  id: string,
  name: string,
  type: string,
  address: string,
  data?: AccountData,
}

export type Accounts = { [_: string]: Account }

// -------------------- Settings

export type Settings = Object

export type T = (string, ?Object) => string

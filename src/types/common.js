// @flow

export type Device = {
  vendorId: string,
  productId: string,
  path: string,
}

export type Devices = Array<Device>

export type Account = {
  name: string,
  type: string,
  address: string,
}

export type Accounts = Array<Account>

export type T = (string, ?Object) => string

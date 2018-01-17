// @flow

export type Device = {
  vendorId: string,
  productId: string,
  path: string,
}

export type Devices = Array<Device>

export type Account = {
  id: string,
  name: string,
  type: string,
  address: string,
}

export type Accounts = Object

export type Settings = Object

export type T = (string, ?Object) => string

// @flow

export type Device = {
  vendorId: string,
  productId: string,
  path: string,
} | null

export type Devices = Array<Device>

export type T = (string, ?Object) => string

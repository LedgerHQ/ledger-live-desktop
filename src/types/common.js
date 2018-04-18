// @flow

export type Device = {
  manufacturer: string,
  path: string,
  product: string,
  productId: string,
  vendorId: string,
}

export type Devices = Array<Device>

// -------------------- Settings

export type CurrencySettings = {
  coinType: number,

  confirmationsToSpend: number,
  minConfirmationsToSpend: number,
  maxConfirmationsToSpend: number,

  confirmationsNb: number,
  minConfirmationsNb: number,
  maxConfirmationsNb: number,

  transactionFees: number,
}

export type Settings = {
  language: string,
  username: string,
  counterValue: string,
  password: {
    isEnabled: boolean,
    value: string,
  },
  currencies: CurrencySettings[],
}

export type T = (?string, ?Object) => string

// -------------------- Manager

export type MemoryInfos = {
  applicationsSize: number,
  freeSize: number,
  systemSize: number,
  totalAppSlots: number,
  usedAppSlots: number,
}

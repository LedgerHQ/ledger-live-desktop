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
  confirmationsToSpend: number,
  minConfirmationsToSpend: number,
  maxConfirmationsToSpend: number,

  confirmationsNb: number,
  minConfirmationsNb: number,
  maxConfirmationsNb: number,

  transactionFees: number,
}

export type CurrenciesSettings = {
  [coinType: number]: CurrencySettings,
}

export type Settings = {
  language: string,
  orderAccounts: string,
  username: string,
  counterValue: string,
  password: {
    isEnabled: boolean,
    value: string,
  },
  marketIndicator: 'eastern' | 'western',
  currenciesSettings: CurrenciesSettings,
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

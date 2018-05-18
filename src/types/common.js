// @flow

export type Device = {
  manufacturer: string,
  path: string,
  product: string,
  productId: string,
  vendorId: string,
}

// -------------------- Settings

export type CurrencySettings = {
  confirmationsToSpend: number,
  minConfirmationsToSpend: number,
  maxConfirmationsToSpend: number,

  confirmationsNb: number,
  minConfirmationsNb: number,
  maxConfirmationsNb: number,

  transactionFees: number,

  exchange: string,
}

export type CurrenciesSettings = {
  [id: string]: CurrencySettings,
}

export type Settings = {
  hasCompletedOnboarding: boolean,
  language: string,
  orderAccounts: string,
  counterValue: string,
  password: {
    isEnabled: boolean,
    value: string,
  },
  marketIndicator: 'eastern' | 'western',
  currenciesSettings: CurrenciesSettings,
  region: string,
  developerMode: boolean,
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

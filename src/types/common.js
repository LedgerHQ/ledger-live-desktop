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
  confirmationsNb: number,
  exchange: ?string,
}

export type CurrenciesSettings = {
  [id: string]: CurrencySettings,
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

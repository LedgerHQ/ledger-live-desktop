// @flow
import type { DeviceModelId } from '@ledgerhq/devices'

export type Device = {
  path: string,
  modelId: DeviceModelId,
  // EXPERIMENTAL
  appName?: string,
  version?: string,
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

// @flow
import type { DeviceModelId } from '@ledgerhq/devices'

export type Device = {
  path: string,
  modelId: DeviceModelId,
}

// -------------------- Settings

export type CurrencySettings = {
  confirmationsNb: number,
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

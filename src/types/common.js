// @flow

export type Device = {
  vendorId: string,
  productId: string,
  path: string,
}

export type Devices = Array<Device>

// -------------------- Settings

export type SettingsProfile = {
  password: {
    state: boolean,
    value: string,
  },
}

export type SettingsDisplay = {
  language: string,
}

export type SettingsMoney = {
  counterValue: string,
}

export type Settings = SettingsProfile & SettingsDisplay & SettingsMoney

export type T = (string, ?Object) => string

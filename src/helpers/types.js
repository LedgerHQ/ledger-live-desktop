// @flow
type Id = number

export type LedgerScriptParams = {
  firmware: string,
  firmwareKey: string,
  delete?: string,
  deleteKey?: string,
  targetId?: string | number,
  hash: string,
  perso: string,
}

export type DeviceInfo = {
  targetId: string | number,
  seVersion: string,
  isBootloader: boolean,
  flags: string,
  mcuVersion: string,
  isOSU: boolean,
  providerName: string,
  providerId: number,
  fullVersion: string,
}

export type DeviceVersion = {
  id: Id,
  name: string,
  display_name: string,
  target_id: string,
  description: string,
  device: Id,
  providers: Array<Id>,
  mcu_versions: Array<Id>,
  se_firmware_final_versions: Array<Id>,
  osu_versions: Array<Id>,
  application_versions: Array<Id>,
  date_creation: string,
  date_last_modified: string,
}

export type McuVersion = {
  id: Id,
  mcu: Id,
  name: string,
  description: ?string,
  providers: Array<Id>,
  from_bootloader_version: string,
  device_versions: Array<Id>,
  se_firmware_final_versions: Array<Id>,
  date_creation: string,
  date_last_modified: string,
}

export type FirmwareInfo = {
  targetId: Id,
  seVersion: string,
  flags: string,
  mcuVersion: string,
}

type BaseFirmware = {
  id: Id,
  name: string,
  description: ?string,
  display_name: ?string,
  notes: ?string,
  perso: string,
  firmware: string,
  firmware_key: string,
  hash: string,
  date_creation: string,
  date_last_modified: string,
  device_versions: Array<Id>,
  providers: Array<Id>,
}

export type OsuFirmware = BaseFirmware & {
  next_se_firmware_final_version: Id,
  previous_se_firmware_final_version: Array<Id>,
}

export type FinalFirmware = BaseFirmware & {
  version: string,
  se_firmware: Id,
  osu_versions: Array<OsuFirmware>,
  mcu_versions: Array<Id>,
  application_versions: Array<Id>,
}

export type ApplicationVersion = {
  id: Id,
  name: string,
  version: string,
  app: Id,
  description: ?string,
  display_name: string,
  icon: string,
  picture: Id,
  notes: ?string,
  perso: string,
  hash: string,
  firmware: string,
  firmware_key: string,
  delete: string,
  delete_key: string,
  device_versions: Array<Id>,
  se_firmware_final_versions: Array<Id>,
  providers: Array<Id>,
  date_creation: string,
  date_last_modified: string,
}

export type Application = {
  id: Id,
  name: string,
  description: ?string,
  application_versions: Array<ApplicationVersion>,
  providers: Array<Id>,
  category: Id,
  publisher: ?Id,
  date_creation: string,
  date_last_modified: string,
}

export type Category = {
  id: Id,
  name: string,
  description: ?string,
  providers: Array<Id>,
  applications: Array<Id>,
  date_creation: string,
  date_last_modified: string,
}

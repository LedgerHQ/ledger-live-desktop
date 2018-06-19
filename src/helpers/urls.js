// @flow
import qs from 'qs'

import { MANAGER_API_BASE, BASE_SOCKET_URL_SECURE } from 'config/constants'
import type { LedgerScriptParams } from 'helpers/common'

const urlBuilder = (base: string) => (endpoint: string): string => `${base}/${endpoint}`

const managerUrlbuilder = urlBuilder(MANAGER_API_BASE)

const wsURLBuilder = (endpoint: string) => (params?: Object) =>
  `${BASE_SOCKET_URL_SECURE}/${endpoint}${params ? `?${qs.stringify(params)}` : ''}`

// const wsURLBuilderProxy = (endpoint: string) => (params?: Object) =>
//   `ws://manager.ledger.fr:3501/${endpoint}${params ? `?${qs.stringify(params)}` : ''}`

export const GET_DEVICE_VERSION: string = managerUrlbuilder('get_device_version')
export const APPLICATIONS_BY_DEVICE: string = managerUrlbuilder('get_apps')
export const GET_CURRENT_FIRMWARE: string = managerUrlbuilder('get_firmware_version')
export const GET_LATEST_FIRMWARE: string = managerUrlbuilder('get_latest_firmware')
export const GET_NEXT_MCU: string = managerUrlbuilder('mcu_versions_bootloader')

export const WS_INSTALL: (arg: LedgerScriptParams) => string = wsURLBuilder('install')
export const WS_GENUINE: (arg: { targetId: string | number }) => string = wsURLBuilder('genuine')
export const WS_MCU: (arg: { targetId: string | number, version: string }) => string = wsURLBuilder(
  'mcu',
)

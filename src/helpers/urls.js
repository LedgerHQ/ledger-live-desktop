// @flow
import qs from 'qs'

import { MANAGER_API_BASE, BASE_SOCKET_URL_SECURE } from 'config/constants'

const urlBuilder = (base: string) => (endpoint: string): string => `${base}/${endpoint}`
const managerUrlbuilder = urlBuilder(MANAGER_API_BASE)

const wsURLBuilder = (endpoint: string) => (params?: Object) =>
  `${BASE_SOCKET_URL_SECURE}/${endpoint}${params ? `?${qs.stringify(params)}` : ''}`

export const DEVICE_VERSION_BY_TARGET_ID = managerUrlbuilder('device_versions_target_id')
export const APPLICATIONS_BY_DEVICE = managerUrlbuilder('get_apps')
export const FIRMWARE_FINAL_VERSIONS_NAME = managerUrlbuilder('firmware_final_versions_name')

export const WS_INSTALL = wsURLBuilder('install')
export const WS_GENUINE = wsURLBuilder('genuine')
export const WS_MCU = wsURLBuilder('genuine')

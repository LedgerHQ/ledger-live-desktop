// @flow

const intFromEnv = (key: string, def: number): number => {
  const v = process.env[key]
  if (!isNaN(v)) return parseInt(v, 10)
  return def
}
const boolFromEnv = (key: string, def: boolean = false): boolean => {
  const v = process.env[key]
  if (typeof v === 'string') return !(v === '0' || v === 'false')
  return def
}

const stringFromEnv = (key: string, def: string): string => process.env[key] || def

// Size

export const DEFAULT_WINDOW_WIDTH = intFromEnv('LEDGER_DEFAULT_WINDOW_WIDTH', 1024)
export const DEFAULT_WINDOW_HEIGHT = intFromEnv('LEDGER_DEFAULT_WINDOW_HEIGHT', 768)
export const MIN_WIDTH = intFromEnv('LEDGER_MIN_WIDTH', 1024)
export const MIN_HEIGHT = intFromEnv('LEDGER_MIN_HEIGHT', 700)

// time and delays...

export const CHECK_APP_INTERVAL_WHEN_INVALID = 600
export const CHECK_APP_INTERVAL_WHEN_VALID = 1200
export const CHECK_UPDATE_DELAY = 5000
export const DEVICE_DISCONNECT_DEBOUNCE = intFromEnv('LEDGER_DEVICE_DISCONNECT_DEBOUNCE', 1000)
export const DEVICE_INFOS_TIMEOUT = intFromEnv('DEVICE_INFOS_TIMEOUT', 5 * 1000)
export const GENUINE_CACHE_DELAY = intFromEnv('GENUINE_CACHE_DELAY', 1000)
export const GENUINE_TIMEOUT = intFromEnv('GENUINE_TIMEOUT', 120 * 1000)
export const GET_CALLS_RETRY = intFromEnv('GET_CALLS_RETRY', 2)
export const GET_CALLS_TIMEOUT = intFromEnv('GET_CALLS_TIMEOUT', 30 * 1000)
export const LISTEN_DEVICES_POLLING_INTERVAL = intFromEnv('LISTEN_DEVICES_POLLING_INTERVAL', 100)
export const OUTDATED_CONSIDERED_DELAY = intFromEnv('OUTDATED_CONSIDERED_DELAY', 5 * 60 * 1000)
export const SYNC_ALL_INTERVAL = 120 * 1000
export const SYNC_BOOT_DELAY = 2 * 1000
export const SYNC_MAX_CONCURRENT = intFromEnv('LEDGER_SYNC_MAX_CONCURRENT', 1)
export const SYNC_TIMEOUT = intFromEnv('SYNC_TIMEOUT', 30 * 1000)

// Endpoints...

export const LEDGER_COUNTERVALUES_API = stringFromEnv(
  'LEDGER_COUNTERVALUES_API',
  'https://beta.manager.live.ledger.fr/countervalues',
)
export const LEDGER_REST_API_BASE = stringFromEnv(
  'LEDGER_REST_API_BASE',
  'https://api.ledgerwallet.com/',
)
export const MANAGER_API_BASE = stringFromEnv(
  'MANAGER_API_BASE',
  'https://beta.manager.live.ledger.fr/api',
)
export const BASE_SOCKET_URL = stringFromEnv('BASE_SOCKET_URL', 'ws://api.ledgerwallet.com/update')
export const BASE_SOCKET_URL_SECURE = stringFromEnv(
  'BASE_SOCKET_URL',
  'wss://api.ledgerwallet.com/update',
)

// Flags

export const DEBUG_ANALYTICS = boolFromEnv('DEBUG_ANALYTICS')
export const DEBUG_DEVICE = boolFromEnv('DEBUG_DEVICE')
export const DEBUG_NETWORK = boolFromEnv('DEBUG_NETWORK')
export const DEBUG_COMMANDS = boolFromEnv('DEBUG_COMMANDS')
export const DEBUG_DB = boolFromEnv('DEBUG_DB')
export const DEBUG_ACTION = boolFromEnv('DEBUG_ACTION')
export const DEBUG_TAB_KEY = boolFromEnv('DEBUG_TAB_KEY')
export const DEBUG_LIBCORE = boolFromEnv('DEBUG_LIBCORE')
export const DEBUG_WS = boolFromEnv('DEBUG_WS')
export const DEBUG_SYNC = boolFromEnv('DEBUG_SYNC')
export const LEDGER_RESET_ALL = boolFromEnv('LEDGER_RESET_ALL')
export const LEDGER_DEBUG_ALL_LANGS = boolFromEnv('LEDGER_DEBUG_ALL_LANGS')
export const SKIP_GENUINE = boolFromEnv('SKIP_GENUINE')
export const SKIP_ONBOARDING = boolFromEnv('SKIP_ONBOARDING')
export const SHOW_LEGACY_NEW_ACCOUNT = boolFromEnv('SHOW_LEGACY_NEW_ACCOUNT')
export const HIGHLIGHT_I18N = boolFromEnv('HIGHLIGHT_I18N')
export const DISABLE_ACTIVITY_INDICATORS = boolFromEnv('DISABLE_ACTIVITY_INDICATORS')
export const EXPERIMENTAL_CENTER_MODAL = boolFromEnv('EXPERIMENTAL_CENTER_MODAL')
export const EXPERIMENTAL_FIRMWARE_UPDATE = boolFromEnv('EXPERIMENTAL_FIRMWARE_UPDATE')
export const EXPERIMENTAL_HTTP_ON_RENDERER = boolFromEnv('EXPERIMENTAL_HTTP_ON_RENDERER')
export const EXPERIMENTAL_TOOLS_SETTINGS = boolFromEnv('EXPERIMENTAL_TOOLS_SETTINGS')

// Other constants

export const MAX_ACCOUNT_NAME_SIZE = 30

export const MODAL_ADD_ACCOUNTS = 'MODAL_ADD_ACCOUNTS'
export const MODAL_OPERATION_DETAILS = 'MODAL_OPERATION_DETAILS'
export const MODAL_RECEIVE = 'MODAL_RECEIVE'
export const MODAL_SEND = 'MODAL_SEND'
export const MODAL_SETTINGS_ACCOUNT = 'MODAL_SETTINGS_ACCOUNT'
export const MODAL_RELEASES_NOTES = 'MODAL_RELEASES_NOTES'

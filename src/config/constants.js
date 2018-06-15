// @flow

const intFromEnv = (key: string, def: number) => {
  const v = process.env[key]
  if (!isNaN(v)) return parseInt(v, 10)
  return def
}

export const GET_CALLS_TIMEOUT = intFromEnv('GET_CALLS_TIMEOUT', 30 * 1000)
export const GET_CALLS_RETRY = intFromEnv('GET_CALLS_RETRY', 2)

export const SYNC_MAX_CONCURRENT = intFromEnv('LEDGER_SYNC_MAX_CONCURRENT', 6)
export const SYNC_BOOT_DELAY = 2 * 1000
export const SYNC_ALL_INTERVAL = 60 * 1000

export const CHECK_APP_INTERVAL_WHEN_INVALID = 600
export const CHECK_APP_INTERVAL_WHEN_VALID = 1200
export const CHECK_UPDATE_DELAY = 5e3

export const DEVICE_DISCONNECT_DEBOUNCE = intFromEnv('LEDGER_DEVICE_DISCONNECT_DEBOUNCE', 500)

export const MODAL_ADD_ACCOUNTS = 'MODAL_ADD_ACCOUNTS'
export const MODAL_OPERATION_DETAILS = 'MODAL_OPERATION_DETAILS'
export const MODAL_RECEIVE = 'MODAL_RECEIVE'
export const MODAL_SEND = 'MODAL_SEND'
export const MODAL_SETTINGS_ACCOUNT = 'MODAL_SETTINGS_ACCOUNT'
export const MODAL_RELEASES_NOTES = 'MODAL_RELEASES_NOTES'

// Socket endpoint

export const BASE_SOCKET_URL = 'ws://api.ledgerwallet.com/update'
export const MANAGER_API_URL = 'wss://api.ledgerwallet.com/update'
export const API_BASE_URL = process.env.API_BASE_URL || 'https://beta.manager.live.ledger.fr/api'

// List of APDUS
export const APDUS = {
  GET_FIRMWARE: [0xe0, 0x01, 0x00, 0x00],
  // we dont have common call that works inside app & dashboard
  // TODO: this should disappear.
  GET_FIRMWARE_FALLBACK: [0xe0, 0xc4, 0x00, 0x00],
}

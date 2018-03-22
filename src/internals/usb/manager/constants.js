// Socket endpoint
export const BASE_SOCKET_URL = 'ws://api.ledgerwallet.com/update/install'

// Apparently params we need to add to websocket requests
//
// see https://github.com/LedgerHQ/ledger-manager-chrome
//   > controllers/manager/ApplyUpdateController.scala
//
// @TODO: Get rid of them.
export const DEFAULT_SOCKET_PARAMS = {
  perso: 'perso_11',
  hash: '0000000000000000000000000000000000000000000000000000000000000000',
}

// List of APDUS
export const APDUS = {
  GET_FIRMWARE: [0xe0, 0x01, 0x00, 0x00],
}

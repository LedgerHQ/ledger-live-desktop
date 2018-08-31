// @flow
import Websocket from 'ws'
import type { WebSocket as WebSocketType } from 'ws'

import network from '../api/network'
import {
  LedgerAPINotAvailable,
  ManagerAPIsFail,
  CountervaluesApiFails,
  WebsocketConnectionFailed,
} from '../config/errors'
import { LEDGER_COUNTERVALUES_API } from '../config/constants'
import { GET_APPLICATIONS } from './urls'

export const checkCounterValues = async () => {
  try {
    const countervalues = await network({
      method: 'GET',
      url: `${LEDGER_COUNTERVALUES_API}/status`,
    })
    if (countervalues.statusText !== 'OK' || countervalues.status !== 200) {
      throw new LedgerAPINotAvailable()
    }
  } catch (err) {
    throw new LedgerAPINotAvailable()
  }
}

export const checkManager = async () => {
  try {
    const manager = await network({ method: 'GET', url: GET_APPLICATIONS })
    if (manager.statusText !== 'OK' || manager.status !== 200) {
      throw new ManagerAPIsFail()
    }
  } catch (err) {
    throw new ManagerAPIsFail()
  }
}

export const checkBlockchain = async () => {
  try {
    const blockchain = await network({
      method: 'GET',
      url: 'https://api.ledgerwallet.com/blockchain/v2/btc/fees',
    })
    if (blockchain.statusText !== 'OK' || blockchain.status !== 200) {
      throw new CountervaluesApiFails()
    }
  } catch (err) {
    throw new CountervaluesApiFails()
  }
}

export const checkSecureWebsockets = async () =>
  new Promise((resolve, reject) => {
    const socket: WebSocketType = new Websocket('wss://echo.websocket.org/')
    socket.on('open', () => {
      socket.close()
      resolve()
    })
    socket.on('error', () => {
      socket.close()
      reject(new WebsocketConnectionFailed())
    })
  })

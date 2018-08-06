// @flow

import { createCommand, Command } from 'helpers/ipc'
import Websocket from 'ws'
import { fromPromise } from 'rxjs/observable/fromPromise'

import network from 'api/network'
import { GET_APPLICATIONS, WS_CHECK } from 'helpers/urls'
import { LEDGER_COUNTERVALUES_API } from 'config/constants'
import {
  LedgerAPINotAvailable,
  ManagerAPIsFail,
  CountervaluesApiFails,
  WebsocketConnectionFailed,
} from 'config/errors'

type Input = void
type Result = void

const check = async () => {
  let socket
  try {
    const countervalues = await network({
      method: 'GET',
      url: `${LEDGER_COUNTERVALUES_API}/status`,
    })
    if (countervalues.statusText !== 'OK' || countervalues.status !== 200) {
      throw new LedgerAPINotAvailable()
    }

    const manager = await network({ method: 'GET', url: GET_APPLICATIONS })
    if (manager.statusText !== 'OK' || manager.status !== 200) {
      throw new ManagerAPIsFail()
    }

    const blockchain = await network({
      method: 'GET',
      url: 'https://api.ledgerwallet.com/blockchain/v2/btc/fees',
    })
    if (blockchain.statusText !== 'OK' || blockchain.status !== 200) {
      throw new CountervaluesApiFails()
    }

    try {
      socket = new Websocket('wss://echo.websocket.org/')
      socket.on('open', () => {
        socket.close()
      })
      socket.on('error', () => {
        socket.close()
        throw new WebsocketConnectionFailed()
      })
    } catch (err) {
      throw new WebsocketConnectionFailed()
    }
  } catch (err) {
    throw err
  }
}

const cmd: Command<Input, Result> = createCommand('healthCheck', () => fromPromise(check()))

export default cmd

// @flow

import { createCommand, Command } from 'helpers/ipc'
// import Websocket from 'ws'
import { fromPromise } from 'rxjs/observable/fromPromise'

import network from 'api/network'
import { GET_APPLICATIONS } from 'helpers/urls'
import { LEDGER_COUNTERVALUES_API } from 'config/constants'
import {
  LedgerAPINotAvailable,
  ManagerAPIsFail,
  CountervaluesApiFails,
  // WebsocketConnectionFailed,
} from 'config/errors'

type Input = void
type Result = void

const check = async () => {
  // let socket
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

    // FIXME: WE NEED A URL TO OPEN A SECURE WEBSOCKET CHANNEL

    // try {
    //   socket = new Websocket(BASE_SOCKET_URL)
    //   socket.close()
    // } catch (err) {
    //   throw new WebsocketConnectionFailed()
    // }
  } catch (err) {
    throw err
  }
}

const cmd: Command<Input, Result> = createCommand('healthCheck', () => fromPromise(check()))

export default cmd

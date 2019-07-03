// @flow
import WebSocket from 'ws'
import '@ledgerhq/live-common/lib/load/tokens/ethereum/erc20'
import { setNetwork, setWebSocketImplementation } from '@ledgerhq/live-common/lib/network'
import { listen as listenLogs } from '@ledgerhq/logs'
import { logs as websocketLogs } from '@ledgerhq/live-common/lib/api/socket'
import network from 'api/network'
import logger from 'logger'
import './live-common-set-supported-currencies'

listenLogs(({ id, date, ...log }) => logger.debug(log))

setWebSocketImplementation(WebSocket)
setNetwork(network)

websocketLogs.subscribe(({ type, message, ...rest }) => {
  const obj = rest
  if (message) obj.msg = message
  logger.websocket(type, obj)
})

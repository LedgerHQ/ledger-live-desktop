// @flow
import WebSocket from 'ws'
import { setNetwork, setWebSocketImplementation } from '@ledgerhq/live-common/lib/network'
import { logs as websocketLogs } from '@ledgerhq/live-common/lib/api/socket'
import network from 'api/network'
import logger from 'logger'

setWebSocketImplementation(WebSocket)
setNetwork(network)

websocketLogs.subscribe(({ type, message, ...rest }) => {
  const obj = rest
  if (message) obj.msg = message
  logger.websocket(type, obj)
})

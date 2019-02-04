// @flow
import WebSocket from 'ws'
import { setNetwork, setWebSocketImplementation } from '@ledgerhq/live-common/lib/network'
import { logs as websocketLogs } from '@ledgerhq/live-common/lib/api/socket'
import { setEnv } from '@ledgerhq/live-common/lib/env'
import network from 'api/network'
import * as constants from 'config/constants'
import logger from 'logger'

setWebSocketImplementation(WebSocket)
setNetwork(network)
setEnv('FORCE_PROVIDER', constants.FORCE_PROVIDER)

websocketLogs.subscribe(({ type, message, ...rest }) => {
  const obj = rest
  if (message) obj.msg = message
  logger.websocket(type, obj)
})

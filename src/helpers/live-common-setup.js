// @flow
import WebSocket from 'ws'
import { setNetwork, setWebSocketImplementation } from '@ledgerhq/live-common/lib/network'
import { setEnv } from '@ledgerhq/live-common/lib/env'
import network from 'api/network'
import * as constants from 'config/constants'

setWebSocketImplementation(WebSocket)
setNetwork(network)
setEnv('FORCE_PROVIDER', constants.FORCE_PROVIDER)

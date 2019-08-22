// @flow
import { setEnv } from '@ledgerhq/live-common/lib/env'
import { setBridgeProxy } from '@ledgerhq/live-common/lib/bridge'
import { getAccountBridge, getCurrencyBridge } from '../bridge/proxy'
import { getUserId } from './user'

setEnv('USER_ID', getUserId())

setBridgeProxy({ getAccountBridge, getCurrencyBridge })

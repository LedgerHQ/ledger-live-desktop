// @flow
import { setBridgeProxy } from '@ledgerhq/live-common/lib/bridge'
import { getAccountBridge, getCurrencyBridge } from '../bridge/proxy'
import { getUserId } from './user'
import { setEnvOnAllThreads } from './env'

setEnvOnAllThreads('USER_ID', getUserId())

setBridgeProxy({ getAccountBridge, getCurrencyBridge })

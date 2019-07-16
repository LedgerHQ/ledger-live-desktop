// @flow
import { setEnv } from '@ledgerhq/live-common/lib/env'
import { getUserId } from './user'

setEnv('USER_ID', getUserId())

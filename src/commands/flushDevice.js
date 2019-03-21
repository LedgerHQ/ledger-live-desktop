// @flow
import { from } from 'rxjs'
import flush from '@ledgerhq/live-common/lib/hw/flush'
import { createCommand, Command } from 'helpers/ipc'

type Input = string
type Result = Promise<void>

const cmd: Command<Input, Result> = createCommand('flushDevice', deviceId => from(flush(deviceId)))

export default cmd

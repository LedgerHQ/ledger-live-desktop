// @flow

import { createCommand } from 'helpers/ipc'
import { listenDevices } from 'helpers/live-common-setup-internal-hw'

const cmd: any = createCommand('listenDevices', listenDevices)

export default cmd

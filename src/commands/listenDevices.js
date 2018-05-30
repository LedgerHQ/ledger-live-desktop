// @flow

import { createCommand } from 'helpers/ipc'
import { Observable } from 'rxjs'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

const cmd = createCommand('listenDevices', () => Observable.create(CommNodeHid.listen))

export default cmd

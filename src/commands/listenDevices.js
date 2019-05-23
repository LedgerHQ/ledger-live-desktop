// @flow

import { createCommand } from 'helpers/ipc'
import { Observable } from 'rxjs'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import { LISTEN_DEVICES_DEBOUNCE } from 'config/constants'

CommNodeHid.setListenDevicesDebounce(LISTEN_DEVICES_DEBOUNCE)
const cmd: any = createCommand('listenDevices', () => Observable.create(CommNodeHid.listen))

export default cmd

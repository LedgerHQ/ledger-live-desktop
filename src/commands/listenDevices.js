// @flow

import { createCommand } from 'helpers/ipc'
import { Observable } from 'rxjs'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

const DEBOUNCE_REMOVE_DEVICE_EVENT = 500

const cmd = createCommand('listenDevices', () =>
  Observable.create(o => {
    const pendingRemovePerPath = {}
    const sub = CommNodeHid.listen({
      next: e => {
        // debounce the add/remove in case we see quick `remove,add` events on same path.
        switch (e.type) {
          case 'add': {
            const pendingRemove = pendingRemovePerPath[e.descriptor]
            if (pendingRemove) {
              console.warn(`Skipping remove/add usb event for ${e.descriptor}`)
              // there where a recent "remove" event, we don't emit add because we didn't emit "remove" yet.
              clearTimeout(pendingRemove)
              delete pendingRemovePerPath[e.descriptor]
            } else {
              // if there were no recent "remove", we just emit the "add"
              o.next(e)
            }
            break
          }
          case 'remove': {
            // we we always debounce the "remove" event. emit it a bit later in case a "add" of same descriptor happen soon.
            if (pendingRemovePerPath[e.descriptor]) {
              clearTimeout(pendingRemovePerPath[e.descriptor])
            }
            pendingRemovePerPath[e.descriptor] = setTimeout(() => {
              delete pendingRemovePerPath[e.descriptor]
              o.next(e)
            }, DEBOUNCE_REMOVE_DEVICE_EVENT)
            break
          }
          default:
            o.next(e)
        }
      },
      complete: () => {
        o.complete()
      },
      error: err => {
        o.error(err)
      },
    })
    return () => {
      Object.keys(pendingRemovePerPath).map(k => clearTimeout(pendingRemovePerPath[k]))
      sub.unsubscribe()
    }
  }),
)

export default cmd

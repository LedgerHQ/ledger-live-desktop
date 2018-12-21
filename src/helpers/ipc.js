// @flow
import logger from 'logger'
import { Observable } from 'rxjs'
import uuidv4 from 'uuid/v4'
import { deserializeError } from '@ledgerhq/live-common/lib/errors/helpers'

export function createCommand<In, A>(id: string, impl: In => Observable<A>): Command<In, A> {
  return new Command(id, impl)
}

export class Command<In, A> {
  id: string
  impl: In => Observable<A>

  constructor(id: string, impl: In => Observable<A>) {
    this.id = id
    this.impl = impl
  }

  /**
   * Usage example:
   * sub = cmd.send(data).subscribe({ next: ... })
   * // or
   * const res = await cmd.send(data).toPromise()
   */
  send(data: In): Observable<A> {
    return ipcRendererSendCommand(this.id, data)
  }
}

type Msg<A> = {
  type: 'cmd.NEXT' | 'cmd.COMPLETE' | 'cmd.ERROR',
  requestId: string,
  data?: A,
}

// Implements command message of (Renderer proc -> Main proc)
function ipcRendererSendCommand<In, A>(id: string, data: In): Observable<A> {
  const { ipcRenderer } = require('electron')
  return Observable.create(o => {
    const requestId: string = uuidv4()
    const startTime = Date.now()

    const unsubscribe = () => {
      ipcRenderer.send('command-unsubscribe', { requestId })
      ipcRenderer.removeListener('command-event', handleCommandEvent)
    }

    function handleCommandEvent(e, msg: Msg<A>) {
      if (requestId !== msg.requestId) return
      logger.onCmd(msg.type, id, Date.now() - startTime, msg.data)
      switch (msg.type) {
        case 'cmd.NEXT':
          if (msg.data) {
            o.next(msg.data)
          }
          break

        case 'cmd.COMPLETE':
          o.complete()
          ipcRenderer.removeListener('command-event', handleCommandEvent)
          break

        case 'cmd.ERROR': {
          const error = deserializeError(msg.data)
          o.error(error)
          ipcRenderer.removeListener('command-event', handleCommandEvent)
          break
        }

        default:
      }
    }

    ipcRenderer.on('command-event', handleCommandEvent)

    ipcRenderer.send('command', { id, data, requestId })

    logger.onCmd('cmd.START', id, 0, data)

    return unsubscribe
  })
}

// Implements command message of (Main proc -> Renderer proc)
// (dual of ipcRendererSendCommand)
export function ipcMainListenReceiveCommands(o: {
  onUnsubscribe: (requestId: string) => void,
  onCommand: (
    command: { id: string, data: *, requestId: string },
    notifyCommandEvent: (Msg<*>) => void,
  ) => void,
}) {
  const { ipcMain } = require('electron')

  const onCommandUnsubscribe = (event, { requestId }) => {
    o.onUnsubscribe(requestId)
  }

  const onCommand = (event, command) => {
    o.onCommand(command, payload => {
      event.sender.send('command-event', payload)
    })
  }

  ipcMain.on('command-unsubscribe', onCommandUnsubscribe)
  ipcMain.on('command', onCommand)

  return () => {
    ipcMain.removeListener('command-unsubscribe', onCommandUnsubscribe)
    ipcMain.removeListener('command', onCommand)
  }
}

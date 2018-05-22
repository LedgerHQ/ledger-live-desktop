// @flow
import { ipcRenderer } from 'electron'
import { Observable } from 'rxjs'
import uuidv4 from 'uuid/v4'

type Msg<A> = {
  type: string,
  data?: A,
  options?: *,
}

function send<A>(msg: Msg<A>) {
  process.send(msg)
}

export class Command<In, A> {
  channel: string
  type: string
  id: string
  impl: In => Observable<A>
  constructor(channel: string, type: string, impl: In => Observable<A>) {
    this.channel = channel
    this.type = type
    this.id = `${channel}.${type}`
    this.impl = impl
  }

  // ~~~ On exec side we can:

  exec(data: In, requestId: string) {
    return this.impl(data).subscribe({
      next: (data: A) => {
        send({
          type: `NEXT_${requestId}`,
          data,
        })
      },
      complete: () => {
        send({
          type: `COMPLETE_${requestId}`,
          options: { kill: true },
        })
      },
      error: error => {
        send({
          type: `ERROR_${requestId}`,
          data: {
            name: error && error.name,
            message: error && error.message,
          },
          options: { kill: true },
        })
      },
    })
  }

  // ~~~ On renderer side we can:

  /**
   * Usage example:
   * sub = send(data).subscribe({ next: ... })
   * // or
   * const res = await send(data).toPromise()
   */
  send(data: In): Observable<A> {
    return Observable.create(o => {
      const { channel, type, id } = this
      const requestId: string = uuidv4()

      const unsubscribe = () => {
        ipcRenderer.removeListener('msg', handleMsgEvent)
      }

      function handleMsgEvent(e, msg: Msg<A>) {
        switch (msg.type) {
          case `NEXT_${requestId}`:
            if (msg.data) {
              o.next(msg.data)
            }
            break

          case `COMPLETE_${requestId}`:
            o.complete()
            unsubscribe()
            break

          case `ERROR_${requestId}`:
            o.error(msg.data)
            unsubscribe()
            break

          default:
        }
      }

      ipcRenderer.on('msg', handleMsgEvent)

      ipcRenderer.send(channel, {
        type,
        data: {
          id,
          data,
          requestId,
        },
      })

      return unsubscribe
    })
  }
}

export function createCommand<In, A>(
  channel: string,
  type: string,
  impl: In => Observable<A>,
): Command<In, A> {
  return new Command(channel, type, impl)
}

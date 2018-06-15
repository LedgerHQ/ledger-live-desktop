// @flow

import { createCommand } from 'helpers/ipc'
import { Observable } from 'rxjs'
import withLibcore from 'helpers/withLibcore'

const cmd = createCommand('libcoreHardReset', () =>
  Observable.create(o => {
    withLibcore(async core => {
      try {
        core.getPoolInstance().eraseDataSince(new Date(0))
        o.complete()
      } catch (e) {
        o.error(e)
      }
    })
  }),
)

export default cmd

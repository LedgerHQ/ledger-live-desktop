// @flow

import { createCommand } from 'helpers/ipc'
import { Observable } from 'rxjs'
import withLibcore from 'helpers/withLibcore'
import createCustomErrorClass from 'helpers/createCustomErrorClass'
const HardResetFail = createCustomErrorClass('HardResetFail')

const cmd = createCommand('libcoreHardReset', () =>
  Observable.create(o => {
    withLibcore(async core => {
      const result = await core.getPoolInstance().eraseDataSince(new Date(0))
      if (result != core.ERROR_CODE.FUTURE_WAS_SUCCESSFULL) {
        throw new HardResetFail(`Hard reset fail with ${result} (check core.ERROR_CODE)`)
      }
    })
  }),
)

export default cmd

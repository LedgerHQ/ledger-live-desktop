// @flow

import { createCommand } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import withLibcore from 'helpers/withLibcore'
import { createCustomErrorClass } from 'helpers/errors'

const HardResetFail = createCustomErrorClass('HardResetFail')

const cmd = createCommand('libcoreHardReset', () =>
  fromPromise(
    withLibcore(async core => {
      const result = await core.getPoolInstance().eraseDataSince(new Date(0))
      if (result !== core.ERROR_CODE.FUTURE_WAS_SUCCESSFULL) {
        throw new HardResetFail(`Hard reset fail with ${result} (check core.ERROR_CODE)`)
      }
    }),
  ),
)

export default cmd

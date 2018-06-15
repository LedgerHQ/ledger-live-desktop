// @flow

import { fromPromise } from 'rxjs/observable/fromPromise'
import withLibcore from 'helpers/withLibcore'
import { createCommand, Command } from 'helpers/ipc'
import { isValidAddress } from 'helpers/libcore'

type Input = {
  address: string,
  currencyId: string,
}

const cmd: Command<Input, boolean> = createCommand(
  'libcoreValidAddress',
  ({ currencyId, address }) =>
    fromPromise(
      withLibcore(async core => {
        const currency = await core.getPoolInstance().getCurrency(currencyId)
        return isValidAddress(core, currency, address)
      }),
    ),
)

export default cmd

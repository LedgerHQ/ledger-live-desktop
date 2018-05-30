// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'
import signTransactionForCurrency from 'helpers/signTransactionForCurrency'

type Input = {
  currencyId: string,
  devicePath: string,
  path: string,
  transaction: *,
}

type Result = string

const cmd: Command<Input, Result> = createCommand(
  'signTransaction',
  ({ currencyId, devicePath, path, transaction }) =>
    fromPromise(
      withDevice(devicePath)(transport =>
        signTransactionForCurrency(currencyId)(transport, currencyId, path, transaction),
      ),
    ),
)

export default cmd

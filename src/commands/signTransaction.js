// @flow

import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
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
    withDevice(devicePath)(transport =>
      from(signTransactionForCurrency(currencyId)(transport, currencyId, path, transaction)),
    ),
)

export default cmd

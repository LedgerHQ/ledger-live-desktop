// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import signTransactionForCurrency from './signTransactionForCurrency'

type Input = {
  currencyId: string,
  devicePath: string,
  path: string,
  transaction: *,
}

type Result = string

const cmd: Command<Input, Result> = createCommand(
  'devices',
  'signTransaction',
  ({ currencyId, devicePath, path, transaction }) =>
    fromPromise(
      CommNodeHid.open(devicePath).then(transport =>
        signTransactionForCurrency(currencyId)(transport, currencyId, path, transaction),
      ),
    ),
)

export default cmd

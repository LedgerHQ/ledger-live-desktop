// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import CommNodeHid from '@ledgerhq/hw-transport-node-hid'
import getAddressForCurrency from 'helpers/getAddressForCurrency'

type Input = {
  currencyId: string,
  devicePath: string,
  path: string,
  verify?: boolean,
  segwit?: boolean,
}

type Result = {
  address: string,
  path: string,
  publicKey: string,
}

const cmd: Command<Input, Result> = createCommand(
  'devices',
  'getAddress',
  ({ currencyId, devicePath, path, ...options }) =>
    fromPromise(
      CommNodeHid.open(devicePath).then(transport =>
        getAddressForCurrency(currencyId)(transport, currencyId, path, options),
      ),
    ),
)

export default cmd

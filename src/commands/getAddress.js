// @flow

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'
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
      withDevice(devicePath)(transport =>
        getAddressForCurrency(currencyId)(transport, currencyId, path, options),
      ),
    ),
)

export default cmd

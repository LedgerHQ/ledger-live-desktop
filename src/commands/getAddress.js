// @flow

import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import getAddress from '@ledgerhq/live-common/lib/hw/getAddress'

type Input = {
  currencyId: string,
  devicePath: string,
  path: string,
  verify?: boolean,
}

type Result = {
  address: string,
  path: string,
  publicKey: string,
}

const cmd: Command<Input, Result> = createCommand(
  'getAddress',
  ({ currencyId, devicePath, path, ...options }) =>
    withDevice(devicePath)(transport =>
      from(getAddress(transport, getCryptoCurrencyById(currencyId), path, options.verify)),
    ),
)

export default cmd

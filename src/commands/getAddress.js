// @flow

import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import type { DerivationMode } from '@ledgerhq/live-common/lib/types'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'
import getAddress from '@ledgerhq/live-common/lib/hw/getAddress'

type Input = {
  currencyId: string,
  devicePath: string,
  path: string,
  verify?: boolean,
  derivationMode: DerivationMode,
}

type Result = {
  address: string,
  path: string,
  publicKey: string,
}

const cmd: Command<Input, Result> = createCommand(
  'getAddress',
  ({ currencyId, devicePath, ...options }) =>
    withDevice(devicePath)(transport =>
      from(
        getAddress(transport, {
          currency: getCryptoCurrencyById(currencyId),
          ...options,
        }),
      ),
    ),
)

export default cmd

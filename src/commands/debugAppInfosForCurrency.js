// @flow

import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import debugAppInfosForCurrency from '@ledgerhq/live-common/lib/hw/debugAppInfosForCurrency'
import { createCommand, Command } from 'helpers/ipc'
import { from } from 'rxjs'
import { withDevice } from '@ledgerhq/live-common/lib/hw/deviceAccess'

type Input = {
  currencyId: string,
  devicePath: string,
}

type Result = {
  version?: string,
}

const cmd: Command<Input, Result> = createCommand(
  'debugAppInfosForCurrency',
  ({ currencyId, devicePath }) =>
    withDevice(devicePath)(transport =>
      from(debugAppInfosForCurrency(transport, getCryptoCurrencyById(currencyId))),
    ),
)

export default cmd

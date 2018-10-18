// @flow

import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'
import debugAppInfosForCurrency from 'helpers/debugAppInfosForCurrency'

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
    fromPromise(
      withDevice(devicePath)(transport =>
        debugAppInfosForCurrency(transport, getCryptoCurrencyById(currencyId)),
      ),
    ),
)

export default cmd

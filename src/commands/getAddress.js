// @flow

import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { withDevice } from 'helpers/deviceAccess'
import getAddressForCurrency from 'helpers/getAddressForCurrency'

import { DeviceAppVerifyNotSupported, UserRefusedAddress } from 'config/errors'

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
  'getAddress',
  ({ currencyId, devicePath, path, ...options }) =>
    fromPromise(
      withDevice(devicePath)(transport =>
        getAddressForCurrency(transport, getCryptoCurrencyById(currencyId), path, options),
      ).catch(e => {
        if (e && e.name === 'TransportStatusError') {
          if (e.statusCode === 0x6b00 && options.verify) {
            throw new DeviceAppVerifyNotSupported()
          }
          if (e.statusCode === 0x6985) {
            throw new UserRefusedAddress()
          }
        }
        throw e
      }),
    ),
)

export default cmd

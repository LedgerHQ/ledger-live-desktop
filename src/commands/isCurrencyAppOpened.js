// @flow

import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/helpers/currencies'

import { createCommand, Command } from 'helpers/ipc'
import { fromPromise } from 'rxjs/observable/fromPromise'

import { withDevice } from 'helpers/deviceAccess'
import getBitcoinLikeInfo from 'helpers/devices/getBitcoinLikeInfo'
import getAddress from 'helpers/getAddressForCurrency'
import { standardDerivation } from 'helpers/derivations'

type Input = {
  devicePath: string,
  currencyId: string,
}

type Result = boolean

const cmd: Command<Input, Result> = createCommand(
  'isCurrencyAppOpened',
  ({ devicePath, currencyId }) =>
    fromPromise(
      withDevice(devicePath)(async transport => {
        const currency = getCryptoCurrencyById(currencyId)

        // First, we check if the app can derivates on the currency
        try {
          await getAddress(
            transport,
            currency,
            standardDerivation({ currency, segwit: false, x: 0 }),
            { segwit: false },
          )

          // then, just in case of BTC, we need to make sure we are on the correct BTC fork
          const { bitcoinLikeInfo } = currency
          if (bitcoinLikeInfo) {
            const { P2SH, P2PKH } = await getBitcoinLikeInfo(transport)
            return P2SH === bitcoinLikeInfo.P2SH && P2PKH === bitcoinLikeInfo.P2PKH
          }

          // in case of ETH / XRP, the address derivation is enough
          return true
        } catch (e) {
          console.log(e)
          // if anything failed, it does not pass
          return false
        }
      }),
    ),
)

export default cmd

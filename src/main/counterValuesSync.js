// @flow

import { fetchCurrentCounterValues } from '@ledgerhq/wallet-common/lib/api/countervalue'

type SendFunction = (type: string, data: *) => void

export default async (send: SendFunction, { counterValue, currencies }: Object) => {
  try {
    const data = await fetchCurrentCounterValues(currencies, counterValue)
    send('counterValues.update', data)
  } catch (err) {
    console.error(err) // eslint-disable-line no-console
  }
}

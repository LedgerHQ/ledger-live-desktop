// @flow

import { fetchCurrentRates } from '@ledgerhq/live-common/lib/api/countervalue'

type SendFunction = (type: string, data: *) => void

export default async (send: SendFunction, { counterValue, currencies }: Object) => {
  try {
    const data = await fetchCurrentRates(currencies, counterValue)
    send('counterValues.update', data)
  } catch (err) {
    console.error(err) // eslint-disable-line no-console
  }
}

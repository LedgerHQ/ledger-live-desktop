// @flow

import axios from 'axios'

type SendFunction = (type: string, data: *) => void

export default async (send: SendFunction, { counterValue, currencies }: Object) => {
  const data = await axios
    .get(
      `https://min-api.cryptocompare.com/data/pricemulti?extraParams=ledger-test&fsyms=${currencies.join(
        ',',
      )}&tsyms=${counterValue}`,
    )
    .then(({ data }) =>
      currencies.reduce((result, code) => {
        result.push({
          symbol: `${code}-${counterValue}`,
          value: data[code][counterValue],
        })
        return result
      }, []),
    )
  send('counterValues.update', data)
}

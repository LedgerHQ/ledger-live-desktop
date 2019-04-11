// @flow
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import { listCryptoCurrencies } from 'config/cryptocurrencies'
import useEnv from 'hooks/useEnv'

const useCryptocurrencies = (onlyTerminated: boolean = false): ?(CryptoCurrency[]) => {
  const devMode = useEnv('MANAGER_DEV_MODE')
  const cryptos = listCryptoCurrencies(devMode, onlyTerminated)

  return cryptos
}

export default useCryptocurrencies

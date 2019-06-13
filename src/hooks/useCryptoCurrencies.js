// @flow
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import { listCryptoCurrencies } from 'config/cryptocurrencies'
import useEnv from 'hooks/useEnv'

const useCryptocurrencies = ({
  onlyTerminated = false,
  onlySupported = true,
}: {
  onlyTerminated?: boolean,
  onlySupported?: boolean,
}): CryptoCurrency[] => {
  const devMode = useEnv('MANAGER_DEV_MODE')
  const cryptos = listCryptoCurrencies(devMode, onlyTerminated, onlySupported)
  return cryptos
}

export default useCryptocurrencies

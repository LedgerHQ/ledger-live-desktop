// @flow
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { useState, useEffect } from 'react'

import { getFullListSortedCryptoCurrencies } from 'helpers/countervalues'
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
  const [cryptos, setCryptos] = useState(() =>
    listCryptoCurrencies(devMode, onlyTerminated, onlySupported),
  )

  useEffect(() => {
    getFullListSortedCryptoCurrencies(devMode, onlyTerminated, onlySupported).then(setCryptos)
  }, [onlyTerminated, onlySupported, devMode])

  return cryptos
}

export default useCryptocurrencies

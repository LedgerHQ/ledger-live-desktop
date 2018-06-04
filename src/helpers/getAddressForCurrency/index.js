// @flow

import invariant from 'invariant'
import type Transport from '@ledgerhq/hw-transport'
import bitcoin from './btc'
import ethereum from './ethereum'
import ripple from './ripple'

type Resolver = (
  transport: Transport<*>,
  currencyId: string,
  path: string,
  options: {
    segwit?: boolean,
    verify?: boolean,
  },
) => Promise<{ address: string, path: string, publicKey: string }>

type Module = (currencyId: string) => Resolver

const perFamily = {
  bitcoin,
  ethereum,
  ripple,
}

const getAddressForCurrency: Module = (currencyId: string) => {
  const getAddress = perFamily[currencyId]
  invariant(getAddress, `getAddress not implemented for ${currencyId}`)
  return getAddress
}

export default getAddressForCurrency

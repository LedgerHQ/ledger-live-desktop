// @flow

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import invariant from 'invariant'
import type Transport from '@ledgerhq/hw-transport'
import bitcoin from './btc'
import ethereum from './ethereum'
import ripple from './ripple'

type Resolver = (
  transport: Transport<*>,
  currency: CryptoCurrency,
  path: string,
  options: {
    segwit?: boolean,
    verify?: boolean,
  },
) => Promise<{ address: string, path: string, publicKey: string }>

const perFamily: { [_: string]: Resolver } = {
  bitcoin,
  ethereum,
  ripple,
}

const proxy: Resolver = (transport, currency, path, options) => {
  const getAddress = perFamily[currency.family]
  invariant(getAddress, `getAddress not implemented for ${currency.id}`)
  return getAddress(transport, currency, path, options)
}

export default proxy

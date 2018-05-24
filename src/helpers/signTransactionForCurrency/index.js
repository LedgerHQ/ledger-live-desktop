// @flow

import type Transport from '@ledgerhq/hw-transport'

import ethereum from './ethereum'
import ripple from './ripple'

type Resolver = (
  transport: Transport<*>,
  currencyId: string,
  path: string, // if provided use this path, otherwise resolve it
  transaction: *, // any data
) => Promise<string>

type Module = (currencyId: string) => Resolver

const fallback: string => Resolver = currencyId => () =>
  Promise.reject(new Error(`${currencyId} device support not implemented`))

const all = {
  ethereum,
  ethereum_testnet: ethereum,
  ethereum_classic: ethereum,
  ethereum_classic_testnet: ethereum,

  ripple,
}

const m: Module = (currencyId: string) => all[currencyId] || fallback(currencyId)

export default m

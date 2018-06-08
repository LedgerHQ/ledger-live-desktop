// @flow

// import type Transport from '@ledgerhq/hw-transport'

export default async (/* transport: Transport<*> */) =>
  new Promise(resolve => setTimeout(() => resolve(true), 1000))

// @flow

import Store from 'electron-store'
import set from 'lodash/set'
import get from 'lodash/get'

import { getCurrencyByCoinType } from '@ledgerhq/currencies'

import type { Accounts } from 'types/common'

type DBKey = 'settings' | 'accounts'

const encryptionKey = {}

const store = key =>
  new Store({
    name: key,
    defaults: {
      data: null,
    },
    encryptionKey: encryptionKey[key],
  })

export function setEncryptionKey(key: DBKey, value?: string) {
  encryptionKey[key] = value
}

export function serializeAccounts(accounts: Accounts) {
  return accounts.map(account => ({
    id: account.id,
    address: account.address,
    addresses: account.addresses,
    balance: account.balance,
    coinType: account.coinType,
    currency: getCurrencyByCoinType(account.coinType),
    index: account.index,
    name: account.name,
    path: account.path,
    unit: account.unit,
    transactions: account.transactions.map(t => ({
      ...t,
      account,
    })),
  }))
}

export function deserializeAccounts(accounts: Accounts) {
  return accounts.map(account => ({
    id: account.id,
    address: account.address,
    addresses: account.addresses,
    balance: account.balance,
    coinType: account.coinType,
    index: account.index,
    name: account.name,
    path: account.path,
    transactions: account.transactions.map(({ account, ...t }) => t),
    unit: account.unit,
  }))
}

function middleware(type, key, data: any) {
  if (key === 'accounts') {
    if (type === 'get') {
      data = serializeAccounts(data)
    }

    if (type === 'set') {
      data = deserializeAccounts(data)
    }
  }

  return data
}

export default {
  // If the db doesn't exists for that key, init it, with the default value provided
  init: (key: DBKey, defaults: any) => {
    const db = store(key)
    const data = db.get('data')
    if (!data) {
      db.set('data', defaults)
    }
  },

  get: (key: DBKey, defaults: any): any => {
    const db = store(key)
    const data = db.get('data', defaults)
    return middleware('get', key, data)
  },

  set: (key: DBKey, val: any) => {
    const db = store(key)

    val = middleware('set', key, val)

    db.set('data', val)

    return val
  },

  getIn: (key: DBKey, path: string, defaultValue: any) => {
    const db = store(key)

    let data = db.get('data')
    data = middleware('get', key, data)

    return get(data, path, defaultValue)
  },

  setIn: (key: DBKey, path: string, val: any) => {
    const db = store(key)
    const data = db.get('data')

    val = middleware('set', key, val)
    set(data, path, val)

    db.set('data', data)

    return val
  },
}

// @flow

import Store from 'electron-store'
import set from 'lodash/set'
import get from 'lodash/get'

import { serializeAccounts, deserializeAccounts } from 'reducers/accounts'

type DBKey = 'settings' | 'accounts' | 'countervalues'

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

  // TODO flowtype this. we should be able to express all the possible entries and their expected type (with a union type)
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

  resetAll: () => {
    const keys = ['settings', 'accounts']
    keys.forEach(k => {
      const db = store(k)
      db.clear()
    })
  },
}

import Store from 'electron-store'

const encryptionKey = {}

const store = key =>
  new Store({
    name: key,
    defaults: {
      data: null,
    },
    encryptionKey: encryptionKey[key],
  })

export function setEncryptionKey(key, value) {
  encryptionKey[key] = value
}

export default {
  // If the db doesn't exists for that key, init it, with the default value provided
  init: (key, defaults) => {
    const db = store(key)
    const data = db.get('data')
    if (!data) {
      db.set('data', defaults)
    }
  },

  get: key => {
    const db = store(key)
    return db.get('data')
  },

  set: (key, val) => {
    const db = store(key)
    db.set('data', val)
    return db.get('data')
  },
}

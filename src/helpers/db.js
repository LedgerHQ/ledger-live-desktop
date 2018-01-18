import Store from 'electron-store'

const encryptionKey = {}

const store = type =>
  new Store({
    name: type,
    defaults: {},
    encryptionKey: encryptionKey[type],
  })

export function setEncryptionKey(type, value) {
  encryptionKey[type] = value
}

export default (type, values) => {
  const db = store(type)

  if (values) {
    db.store = values
  }

  return db.store
}

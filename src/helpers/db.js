import Store from 'electron-store'

export default {
  accounts: (accounts, options = {}) => {
    const db = new Store({
      name: 'accounts',
      defaults: {},
      ...options,
    })

    if (accounts) {
      db.store = accounts
    }

    return db.store
  },
  settings: settings => {
    const db = new Store({
      name: 'settings',
      defaults: {},
    })

    if (settings) {
      db.store = settings
    }

    return db.store
  },
}

import Store from 'electron-store'

export default {
  accounts: () => {
    const db = new Store({
      name: 'accounts',
      default: {
        accounts: [],
      },
    })

    return {
      get: db.get('accounts'),
      set: accounts => db.get('accounts', accounts),
    }
  },
  settings: () => {
    const db = new Store({
      name: 'settings',
      default: {},
    })

    return db
  },
}

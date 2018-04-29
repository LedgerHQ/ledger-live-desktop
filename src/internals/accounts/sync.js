// @flow

export default (send: Function) => ({
  all: () => {
    setTimeout(() => send('accounts.sync.success'), 5e3)
  },
})

import CommNodeHid from '@ledgerhq/hw-transport-node-hid'

export default function getDevice() {
  return new Promise((resolve, reject) => {
    const sub = CommNodeHid.listen({
      error: err => {
        sub.unsubscribe()
        reject(err)
      },
      next: async e => {
        if (!e.device) {
          return
        }
        if (e.type === 'add') {
          sub.unsubscribe()
          resolve(e.device)
        }
      },
    })
  })
}

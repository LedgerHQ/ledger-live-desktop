import Transport from 'winston-transport'

export default class MainTransport extends Transport {
  logs = []
  capacity = 2000

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    this.logs.unshift(info)
    this.logs.splice(this.capacity)

    callback()
  }
}

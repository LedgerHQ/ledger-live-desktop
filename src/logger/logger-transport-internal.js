import Transport from 'winston-transport'

export default class InternalTransport extends Transport {
  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    process.send({
      type: 'log',
      log: info,
    })

    callback()
  }
}

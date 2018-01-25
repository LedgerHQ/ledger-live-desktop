// @flow

import objectPath from 'object-path'

process.title = `ledger-wallet-desktop-${process.env.FORK_TYPE}`

function sendEvent(type: string, data: any, options: Object = { kill: true }) {
  process.send({ type, data, options })
}

// $FlowFixMe
const func = require(`./${process.env.FORK_TYPE}`) // eslint-disable-line import/no-dynamic-require

const handlers = Object.keys(func).reduce((result, key) => {
  result[key] = func[key](sendEvent)
  return result
}, {})

const onMessage = payload => {
  const { type, data } = payload
  const handler = objectPath.get(handlers, type)
  if (!handler) {
    return
  }
  handler(data)
}

process.on('message', onMessage)

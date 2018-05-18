// @flow

import objectPath from 'object-path'
import capitalize from 'lodash/capitalize'

import cpuUsage from 'helpers/cpuUsage'

require('../env')
require('../init-sentry')

const { DEV_TOOLS, FORK_TYPE } = process.env

process.title = `${require('../../package.json').productName} ${capitalize(FORK_TYPE)}`

function sendEvent(type: string, data: any, options: Object = { kill: true }) {
  process.send({ type, data, options })
}

// $FlowFixMe
let handlers = require(`./${FORK_TYPE}`) // eslint-disable-line import/no-dynamic-require
// handle babel export object syntax
if (handlers.default) {
  handlers = handlers.default
}

process.on('message', payload => {
  const { type, data } = payload
  const handler = objectPath.get(handlers, type)
  if (!handler) {
    console.warn(`No handler found for ${type}`)
    return
  }
  handler(sendEvent, data)
})

if (__DEV__ || DEV_TOOLS) {
  cpuUsage(cpuPercent =>
    sendEvent(
      'usage.cpu',
      {
        name: FORK_TYPE,
        value: cpuPercent,
      },
      {
        window: 'DevWindow',
        kill: false,
      },
    ),
  )
}

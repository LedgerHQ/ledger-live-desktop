// @flow

import objectPath from 'object-path'
import capitalize from 'lodash/capitalize'

import cpuUsage from 'helpers/cpuUsage'

require('../env')
require('../init-sentry')

const { FORK_TYPE } = process.env

process.title = `${require('../../package.json').productName} ${capitalize(FORK_TYPE)}`

function sendEvent(type: string, data: any, options: Object = { kill: true }) {
  process.send({ type, data, options })
}

// $FlowFixMe
const func = require(`./${FORK_TYPE}`) // eslint-disable-line import/no-dynamic-require

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

if (__DEV__) {
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

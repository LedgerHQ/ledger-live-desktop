// @flow

import objectPath from 'object-path'
import capitalize from 'lodash/capitalize'

const { FORK_TYPE } = process.env

process.title = `Ledger Wallet Desktop ${capitalize(FORK_TYPE)}`

function sendEvent(type: string, data: any, options: Object = { kill: true }) {
  process.send({ type, data, options })
}

if (__PROD__ && __SENTRY_URL__) {
  const Raven = require('raven') // eslint-disable-line global-require
  const ravenConfig = { captureUnhandledRejections: true }
  Raven.config(__SENTRY_URL__, ravenConfig).install()
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
  const TIMEOUT_CPU_USAGE = 5e3

  let startTime = process.hrtime()
  let startUsage = process.cpuUsage()

  const cpuUsage = () => {
    const now = Date.now()

    while (Date.now() - now < 500);

    const newStartTime = process.hrtime()
    const newStartUsage = process.cpuUsage()

    const elapTime = process.hrtime(startTime)
    const elapUsage = process.cpuUsage(startUsage)

    startTime = newStartTime
    startUsage = newStartUsage

    const elapTimeMS = elapTime[0] * 1e3 + elapTime[1] / 1e6

    const elapUserMS = elapUsage.user / 1e3
    const elapSystMS = elapUsage.system / 1e3
    const cpuPercent = (100 * (elapUserMS + elapSystMS) / elapTimeMS).toFixed(1)

    sendEvent(
      'usage.cpu',
      {
        name: FORK_TYPE,
        value: cpuPercent,
      },
      {
        kill: false,
      },
    )

    setTimeout(cpuUsage, TIMEOUT_CPU_USAGE)
  }

  cpuUsage()
}

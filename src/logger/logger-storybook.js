const noop = () => {}

module.exports = {
  onCmd: noop,
  onDB: noop,
  onReduxAction: noop,
  onTabKey: noop,
  websocket: noop,
  libcore: noop,
  network: noop,
  networkSucceed: noop,
  networkError: noop,
  networkDown: noop,
  analyticsStart: noop,
  analyticsStop: noop,
  analyticsTrack: noop,
  analyticsPage: noop,
  log: noop,
  info: noop,
  debug: noop,
  warn: noop,
  error: noop,
  critical: noop,
}

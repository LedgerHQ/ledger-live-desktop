const noop = () => {}

module.exports = {
  setProcessShortName: noop,
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
  warn: noop,
  error: noop,
  critical: noop,
}

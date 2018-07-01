import { ipcRenderer } from 'electron'
import { sentryLogsSelector } from 'reducers/settings'

let isSentryInstalled = false

export default store => next => action => {
  next(action)
  const state = store.getState()
  const sentryLogs = sentryLogsSelector(state)
  if (sentryLogs !== isSentryInstalled) {
    isSentryInstalled = sentryLogs
    ipcRenderer.send('sentryLogsChanged', { value: sentryLogs })
  }
}

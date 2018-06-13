import { ipcRenderer } from 'electron'
import { sentryLogsBooleanSelector } from 'reducers/settings'

let isSentryInstalled = false

export default store => next => action => {
  next(action)
  const state = store.getState()
  const sentryLogs = sentryLogsBooleanSelector(state)
  if (sentryLogs !== isSentryInstalled) {
    isSentryInstalled = sentryLogs
    ipcRenderer.send('sentryLogsChanged', { value: sentryLogs })
  }
}

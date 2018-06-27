import { shareAnalyticsSelector } from 'reducers/settings'
import { start, stop } from 'analytics/segment'

let isAnalyticsStarted = false

export default store => next => action => {
  next(action)
  const state = store.getState()
  const shareAnalytics = shareAnalyticsSelector(state)
  if (shareAnalytics !== isAnalyticsStarted) {
    isAnalyticsStarted = shareAnalytics
    if (shareAnalytics) {
      start(store)
    } else {
      stop()
    }
  }
}

// @flow

import { hasCompletedOnboardingSelector } from 'reducers/settings'
import { start } from 'analytics/segment'
import type { State } from 'reducers'

let isAnalyticsStarted = false

export default (store: *) => (next: *) => (action: *) => {
  next(action)
  const state: State = store.getState()
  const hasCompletedOnboarding = hasCompletedOnboardingSelector(state)

  if (hasCompletedOnboarding && !isAnalyticsStarted) {
    isAnalyticsStarted = true
    start(store)
  }
}

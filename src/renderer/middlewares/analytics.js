// @flow

import { hasCompletedOnboardingSelector } from "~/renderer/reducers/settings";
import { start } from "~/renderer/analytics/segment";
import type { State } from "~/renderer/reducers";

let isAnalyticsStarted = false;

export default (store: *) => (next: *) => (action: *) => {
  next(action);
  const state: State = store.getState();
  const hasCompletedOnboarding = hasCompletedOnboardingSelector(state);

  if (hasCompletedOnboarding && !isAnalyticsStarted) {
    isAnalyticsStarted = true;
    start(store);
  }
};

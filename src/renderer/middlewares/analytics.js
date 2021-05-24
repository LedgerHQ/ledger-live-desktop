// @flow
import { start } from "~/renderer/analytics/segment";

let isAnalyticsStarted = false;

export default (store: *) => (next: *) => (action: *) => {
  next(action);

  if (!isAnalyticsStarted) {
    isAnalyticsStarted = true;
    start(store);
  }
};

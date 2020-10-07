// @flow

import React from "react";
import { useSelector } from "react-redux";
import { hasCompletedOnboardingSelector } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";

const TrackAppStart = () => {
  const hasCompletedOnboarding = useSelector(hasCompletedOnboardingSelector);
  return hasCompletedOnboarding ? <Track mandatory onMount event="App Starts" /> : null;
};

export default TrackAppStart;

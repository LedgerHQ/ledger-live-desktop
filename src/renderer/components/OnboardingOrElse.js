// @flow

import React, { memo } from "react";
import { useSelector } from "react-redux";
import { hasCompletedOnboardingSelector } from "~/renderer/reducers/settings";
import { onboardingRelaunchedSelector } from "~/renderer/reducers/onboarding";
import Onboarding from "~/renderer/screens/onboarding";

type Props = {
  children: React$Node,
};

const OnboardingOrElse = ({ children }: Props) => {
  const hasCompletedOnboarding = useSelector(hasCompletedOnboardingSelector);
  const onboardingRelaunched = useSelector(onboardingRelaunchedSelector);

  if (!hasCompletedOnboarding || onboardingRelaunched) {
    return <Onboarding />;
  }

  return children;
};

const ConnectedOnboardingOrElse: React$ComponentType<Props> = memo(OnboardingOrElse);

export default ConnectedOnboardingOrElse;

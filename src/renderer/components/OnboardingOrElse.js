// @flow

import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Box from "~/renderer/components/Box";
import USBTroubleshooting from "~/renderer/screens/USBTroubleshooting";
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
    return (
      <Switch>
        <Route path="/USBTroubleshooting">
          <Box grow style={{ width: "100%", height: "100%" }}>
            <USBTroubleshooting onboarding />
          </Box>
        </Route>
        <Route>
          <Onboarding onboardingRelaunched={!!onboardingRelaunched} />
        </Route>
      </Switch>
    );
  }

  return children;
};

const ConnectedOnboardingOrElse: React$ComponentType<Props> = memo(OnboardingOrElse);

export default ConnectedOnboardingOrElse;

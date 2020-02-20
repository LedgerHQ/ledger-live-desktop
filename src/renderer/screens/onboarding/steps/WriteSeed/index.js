// @flow

import React from "react";
import { getDeviceModel } from "@ledgerhq/devices";
import TrackPage from "~/renderer/analytics/TrackPage";
import GrowScroll from "~/renderer/components/GrowScroll";
import Box from "~/renderer/components/Box";
import { FixedTopContainer } from "../../sharedComponents";
import OnboardingFooter from "../../OnboardingFooter";
import type { StepProps } from "../..";
import WriteSeedRestore from "~/renderer/screens/onboarding/steps/WriteSeed/WriteSeedRestore";
import WriteSeedNano from "~/renderer/screens/onboarding/steps/WriteSeed/WriteSeedNano";
import WriteSeedBlue from "~/renderer/screens/onboarding/steps/WriteSeed/WriteSeedBlue";

const WriteSeed = (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props;

  const model = getDeviceModel(onboarding.deviceModelId || "nanoS");

  return (
    <FixedTopContainer>
      <GrowScroll pb={7}>
        <TrackPage
          category="Onboarding"
          name="Recovery Phase"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        <Box grow alignItems="center">
          {onboarding.flowType === "restoreDevice" ? (
            <WriteSeedRestore onboarding={onboarding} />
          ) : onboarding.deviceModelId !== "blue" ? (
            <WriteSeedNano />
          ) : (
            <WriteSeedBlue />
          )}
        </Box>
      </GrowScroll>
      <OnboardingFooter
        horizontal
        alignItems="center"
        flow={2}
        t={t}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    </FixedTopContainer>
  );
};

export default WriteSeed;

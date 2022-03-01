// @flow
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { lastSeenDeviceSelector } from "~/renderer/reducers/settings";

import { getCurrentDevice } from "~/renderer/reducers/devices";
import ProgressBar from "~/renderer/components/Progress2";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";

const SyncOnboardingController = ({ state, onComplete }: any) => {
  const lastSeenDevice = useSelector(lastSeenDeviceSelector);
  const {
    deviceInfo: { onboarding },
  } = lastSeenDevice || {};
  const device = useSelector(getCurrentDevice);
  const progress = useMemo(() => {
    if (onboarding.currentWord && onboarding.seedSize && device) {
      return onboarding.currentWord / onboarding.seedSize;
    }
    return null;
  }, [device, onboarding.currentWord, onboarding.seedSize]);

  useEffect(() => {
    if (progress === 1) onComplete();
  }, [onComplete, progress]);

  return progress ? (
    <Box mt={60}>
      <Text
        mr="30px"
        ff="Inter|SemiBold"
        lineHeight="18px"
        color={"white"}
        fontSize={20}
      >{`Word #${onboarding.currentWord} or ${onboarding.seedSize}`}</Text>
      <ProgressBar color={"white"} progress={progress} />{" "}
    </Box>
  ) : null;
};

export default SyncOnboardingController;

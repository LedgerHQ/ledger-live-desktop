// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { relaunchOnboarding } from "~/renderer/actions/onboarding";
import Track from "~/renderer/analytics/Track";
import Button from "~/renderer/components/Button";

const LaunchOnboardingBtn = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLaunchOnboarding = useCallback(() => {
    dispatch(relaunchOnboarding(true));
  }, [dispatch]);

  return (
    <>
      <Track onUpdate event={"Launch Onboarding from Settings"} />
      <Button primary small onClick={handleLaunchOnboarding}>
        {t("common.launch")}
      </Button>
    </>
  );
};

export default LaunchOnboardingBtn;

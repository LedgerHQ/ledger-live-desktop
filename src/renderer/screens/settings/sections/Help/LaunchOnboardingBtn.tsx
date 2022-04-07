import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { relaunchOnboarding } from "~/renderer/actions/onboarding";
import Track from "~/renderer/analytics/Track";
import Button from "~/renderer/components/Button";

const LaunchOnboardingBtn = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLaunchOnboarding = useCallback(() => {
    dispatch(relaunchOnboarding(true));
    history.push("/onboarding");
  }, [dispatch, history]);

  return (
    <>
      <Track onUpdate event={"Launch Onboarding from Settings"} />
      <Button variant="main" onClick={handleLaunchOnboarding} style={{ width: "120px" }}>
        {t("common.launch")}
      </Button>
    </>
  );
};

export default LaunchOnboardingBtn;

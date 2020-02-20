// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/renderer/components/Button";
import { OnboardingFooterWrapper } from "./sharedComponents";

type Props = {
  nextStep: () => void,
  prevStep: () => void,
  isContinueDisabled?: boolean,
};

const OnboardingFooter = ({ nextStep, prevStep, isContinueDisabled, ...props }: Props) => {
  const { t } = useTranslation();
  return (
    <OnboardingFooterWrapper {...props}>
      <Button outlineGrey onClick={() => prevStep()}>
        {t("common.back")}
      </Button>
      <Button
        data-e2e="continue_button"
        disabled={isContinueDisabled}
        primary
        onClick={() => nextStep()}
        ml="auto"
      >
        {t("common.continue")}
      </Button>
    </OnboardingFooterWrapper>
  );
};
export default OnboardingFooter;

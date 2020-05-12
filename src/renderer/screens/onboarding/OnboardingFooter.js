// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/renderer/components/Button";
import { OnboardingFooterWrapper } from "./sharedComponents";

type Props = {
  nextStep?: () => void,
  prevStep?: () => void,
  isContinueDisabled?: boolean,
  isBackDisabled?: boolean,
  left?: ?React$Node,
  right?: ?React$Node,
};

const OnboardingFooter = ({
  nextStep,
  prevStep,
  isBackDisabled,
  isContinueDisabled,
  left,
  right,
  ...props
}: Props) => {
  const { t } = useTranslation();

  return (
    <OnboardingFooterWrapper {...props}>
      {left ||
        (prevStep ? (
          <Button
            disabled={isBackDisabled}
            outlineGrey
            onClick={prevStep}
            id="onboarding-back-button"
          >
            {t("common.back")}
          </Button>
        ) : (
          <div />
        ))}
      {right ||
        (nextStep ? (
          <Button
            disabled={isContinueDisabled}
            primary
            onClick={() => nextStep()}
            ml="auto"
            id="onboarding-continue-button"
          >
            {t("common.continue")}
          </Button>
        ) : (
          <div />
        ))}
    </OnboardingFooterWrapper>
  );
};
export default OnboardingFooter;

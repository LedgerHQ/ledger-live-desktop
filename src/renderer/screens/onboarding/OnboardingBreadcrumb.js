// @flow

import React from "react";
import { useSelector } from "react-redux";
import findIndex from "lodash/findIndex";
import { useTranslation } from "react-i18next";
import type { OnboardingState } from "~/renderer/reducers/onboarding";
import { onboardingSelector } from "~/renderer/reducers/onboarding";
import Breadcrumb from "~/renderer/components/Stepper/Breadcrumb";

const OnboardingBreadcrumb = () => {
  const { t } = useTranslation();
  const onboarding: OnboardingState = useSelector(onboardingSelector);
  const { stepName, genuine, onboardingRelaunched } = onboarding;
  const isInitializedFlow = onboarding.flowType === "initializedDevice";

  const regularSteps = onboarding.steps
    .filter(step => !step.external)
    .map(step => ({ ...step, label: t(step.label) }));

  const alreadyInitializedSteps = onboarding.steps
    .filter(step => !step.external && !step.options.alreadyInitSkip)
    .map(step => ({ ...step, label: t(step.label) }));

  const onboardingRelaunchedSteps = onboarding.steps
    .filter(step =>
      isInitializedFlow
        ? !step.options.alreadyInitSkip && !step.external && !step.options.relaunchSkip
        : !step.external && !step.options.relaunchSkip,
    )
    .map(step => ({ ...step, label: t(step.label) }));

  const filteredSteps = onboardingRelaunched
    ? onboardingRelaunchedSteps
    : isInitializedFlow
    ? alreadyInitializedSteps
    : regularSteps;

  const stepIndex = findIndex(filteredSteps, s => s.name === stepName);
  const genuineStepIndex = findIndex(filteredSteps, s => s.name === "genuineCheck");

  return (
    <Breadcrumb
      stepsErrors={genuine.displayErrorScreen ? [genuineStepIndex] : undefined}
      currentStep={stepIndex}
      items={filteredSteps}
    />
  );
};

export default OnboardingBreadcrumb;

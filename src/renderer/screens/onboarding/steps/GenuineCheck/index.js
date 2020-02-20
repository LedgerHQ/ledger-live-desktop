// @flow

import React, { useState, useCallback } from "react";
import { Trans } from "react-i18next";
import { getDeviceModel } from "@ledgerhq/devices";
import styled from "styled-components";
import IconCheck from "~/renderer/icons/Check";
import Button from "~/renderer/components/Button";
import RadioGroup from "~/renderer/components/RadioGroup";
import TrackPage from "~/renderer/analytics/TrackPage";
import { IconOptionRow } from "~/renderer/components/OptionRow";
import Box from "~/renderer/components/Box";
import {
  Title,
  Description,
  FixedTopContainer,
  StepContainerInner,
  GenuineCheckCardWrapper,
} from "../../sharedComponents";
import OnboardingFooter from "../../OnboardingFooter";
import type { StepProps } from "../..";
import GenuineCheckModal from "./GenuineCheckModal";
import GenuineCheckErrorPage from "./GenuineCheckErrorPage";

const CardTitle = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
  textAlign: "left",
  pl: 2,
}))`
  flex-shrink: 1;
`;
const Spacer = styled.div``;

const GenuineCheck = (props: StepProps) => {
  const { nextStep, prevStep, jumpStep, t, onboarding, updateGenuineCheck } = props;
  const { genuine } = onboarding;
  const { displayErrorScreen } = genuine;
  const model = getDeviceModel(onboarding.deviceModelId || "nanoS");

  const [pin, setPin] = useState(undefined);
  const [recovery, setRecovery] = useState(undefined);
  const [isGenuineCheckModalOpened, setGenuineCheckModalOpened] = useState(false);

  const onPinChange = useCallback(
    item => {
      const pass = item.key === "yes";
      setPin(pass);
      if (!pass) {
        updateGenuineCheck({
          displayErrorScreen: true,
        });
      }
    },
    [updateGenuineCheck],
  );

  const onRecoveryChange = useCallback(
    item => {
      const pass = item.key === "yes";
      setRecovery(pass);
      if (!pass) {
        updateGenuineCheck({
          displayErrorScreen: true,
        });
      }
    },
    [updateGenuineCheck],
  );

  const handleOpenGenuineCheckModal = useCallback(() => {
    setGenuineCheckModalOpened(true);
  }, []);

  const handleCloseGenuineCheckModal = useCallback(() => {
    setGenuineCheckModalOpened(false);
  }, []);

  const handleGenuineCheckPass = useCallback(() => {
    updateGenuineCheck({
      isDeviceGenuine: true,
    });
    setGenuineCheckModalOpened(false);
  }, [updateGenuineCheck]);

  const redoGenuineCheck = useCallback(() => {
    setRecovery(undefined);
    setPin(undefined);
    setGenuineCheckModalOpened(false);
    updateGenuineCheck({
      displayErrorScreen: false,
      isDeviceGenuine: false,
    });
  }, [updateGenuineCheck]);

  const handlePrevStep = useCallback(() => {
    onboarding.flowType === "initializedDevice" ? jumpStep("selectDevice") : prevStep();
  }, [onboarding, jumpStep, prevStep]);

  const handleNextStep = useCallback(() => {
    onboarding.onboardingRelaunched ? jumpStep("finish") : nextStep();
  }, [onboarding, jumpStep, nextStep]);

  const radioItems = [
    {
      label: <Trans i18nKey="common.labelYes" />,
      key: "yes",
      pass: true,
    },
    {
      label: <Trans i18nKey="common.labelNo" />,
      key: "no",
      pass: false,
    },
  ];

  if (displayErrorScreen) {
    return (
      <GenuineCheckErrorPage
        pin={!!pin}
        redoGenuineCheck={redoGenuineCheck}
        onboarding={onboarding}
      />
    );
  }

  return (
    <FixedTopContainer>
      <TrackPage
        category="Onboarding"
        name="Genuine Check"
        flowType={onboarding.flowType}
        deviceType={model.productName}
      />
      <StepContainerInner>
        <Title>{t("onboarding.genuineCheck.title")}</Title>
        <Description>
          {t(
            onboarding.flowType === "restoreDevice"
              ? "onboarding.genuineCheck.descRestore"
              : "onboarding.genuineCheck.descGeneric",
          )}
        </Description>
        <GenuineCheckCardWrapper mt={5}>
          <IconOptionRow>{"1."}</IconOptionRow>
          <CardTitle>{t("onboarding.genuineCheck.step1.title")}</CardTitle>
          <RadioGroup
            items={radioItems}
            activeKey={pin === undefined ? "" : pin ? "yes" : "no"}
            onChange={onPinChange}
          />
        </GenuineCheckCardWrapper>
        <GenuineCheckCardWrapper mt={3} isDisabled={!pin}>
          <IconOptionRow color={!pin ? "palette.text.shade60" : "wallet"}>{"2."}</IconOptionRow>
          <CardTitle>{t("onboarding.genuineCheck.step2.title")}</CardTitle>
          {pin && (
            <RadioGroup
              items={radioItems}
              activeKey={recovery === undefined ? "" : recovery ? "yes" : "no"}
              onChange={onRecoveryChange}
            />
          )}
        </GenuineCheckCardWrapper>
        <GenuineCheckCardWrapper mt={3} isDisabled={!recovery}>
          <IconOptionRow color={!recovery ? "palette.text.shade60" : "wallet"}>
            {"3."}
          </IconOptionRow>
          <CardTitle>{t("onboarding.genuineCheck.step3.title")}</CardTitle>
          <Spacer />
          {pin && recovery && (
            <Box justifyContent="center">
              {genuine.isDeviceGenuine ? (
                <Box horizontal alignItems="center" flow={1} color="wallet">
                  <IconCheck size={16} />
                  <Box ff="Inter|SemiBold" fontSize={4}>
                    {t("onboarding.genuineCheck.isGenuinePassed")}
                  </Box>
                </Box>
              ) : (
                <Button primary disabled={!recovery} onClick={handleOpenGenuineCheckModal}>
                  {t("onboarding.genuineCheck.buttons.genuineCheck")}
                </Button>
              )}
            </Box>
          )}
        </GenuineCheckCardWrapper>
      </StepContainerInner>
      <OnboardingFooter
        t={t}
        nextStep={handleNextStep}
        prevStep={handlePrevStep}
        isContinueDisabled={!genuine.isDeviceGenuine}
      />

      <GenuineCheckModal
        isOpened={isGenuineCheckModalOpened}
        onClose={handleCloseGenuineCheckModal}
        onSuccess={handleGenuineCheckPass}
      />
    </FixedTopContainer>
  );
};

export default GenuineCheck;

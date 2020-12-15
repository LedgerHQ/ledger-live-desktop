// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { DeviceModelId } from "@ledgerhq/devices";
import styled from "styled-components";
import Lottie from "react-lottie";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import InfoCircle from "~/renderer/icons/InfoCircle";

import { ContentContainer, HeaderContainer } from "../shared";
import NanoSAnim from "../assets/animations/nanoS/confirm-words.json";
import NanoXAnim from "../assets/animations/nanoX/confirm-words.json";

const ScreenContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 40px 80px;
  box-sizing: border-box;
`;

const ContentFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StepIndexContainer = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(100, 144, 241, 0.1);
  color: #6490f1;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StepTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  flex: 1;
`;

type StepProps = {
  title: string,
  descr?: string,
  index: number,
};

function Step({ title, descr, index }: StepProps) {
  return (
    <StepContainer>
      <StepIndexContainer>
        <Text ff="Inter|Bold" fontSize={2} lineHeight="12.1px">
          {index}
        </Text>
      </StepIndexContainer>
      <StepTextContainer>
        <Text color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5} lineHeight="19.36px">
          {title}
        </Text>
        {descr ? (
          <Text
            mt="8px"
            color="palette.text.shade100"
            ff="Inter|Regular"
            fontSize={4}
            lineHeight="19.5px"
          >
            {descr}
          </Text>
        ) : null}
      </StepTextContainer>
    </StepContainer>
  );
}

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  & > * {
    margin: 12px 0px;
  }

  & > :first-child {
    margin-top: 0px;
  }

  & > :last-child {
    margin-bottom: 0px;
  }
`;

const steps = [
  {
    titleKey: "onboarding.screens.tutorial.screens.recoveryHowTo.enterWord.title",
    descrKey: "onboarding.screens.tutorial.screens.recoveryHowTo.enterWord.descr",
  },
  {
    titleKey: "onboarding.screens.tutorial.screens.recoveryHowTo.validateWord.title",
    descrKey: "onboarding.screens.tutorial.screens.recoveryHowTo.validateWord.descr",
  },
  {
    titleKey: "onboarding.screens.tutorial.screens.recoveryHowTo.andNext.title",
  },
];

type Props = {
  sendEvent: (string, *) => void,
  context: {
    deviceId: DeviceModelId,
  },
};

export function RecoveryHowTo2({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  const { deviceId } = context;

  const onClickHelp = useCallback(() => sendEvent("HELP"), [sendEvent]);
  const onClickPrev = useCallback(() => sendEvent("PREV"), [sendEvent]);
  const onClickNext = useCallback(() => sendEvent("NEXT"), [sendEvent]);

  const defaultOptions = {
    loop: true,
    autoplay: !process.env.SPECTRON_RUN,
    animationData: deviceId === "nanoX" ? NanoXAnim : NanoSAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <ScreenContainer>
      <ContentContainer style={{ marginTop: 94 }}>
        <HeaderContainer>
          <Button color="palette.primary.main" onClick={onClickHelp}>
            <Text mr="8px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.recoveryHowTo.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <Lottie options={defaultOptions} height={130} />
        <StepList>
          {steps.map((step, index) => (
            <Step
              key={index}
              title={t(step.titleKey)}
              descr={step.descrKey ? t(step.descrKey) : undefined}
              index={index + 1 + 2}
            />
          ))}
        </StepList>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.text.shade30" onClick={onClickPrev}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.recoveryHowTo.buttons.prev")}
          </Text>
        </Button>
        <Button id="recovery-howto-2" primary onClick={onClickNext}>
          <Text mr="12px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.recoveryHowTo.buttons.next")}
          </Text>
          <ChevronRight size={13} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}

// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { DeviceModelId } from "@ledgerhq/devices";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import Animation from "~/renderer/animations";
import NanoSAnimLight from "../assets/animations/nanoS/powerOn/light.json";
import NanoSAnimDark from "../assets/animations/nanoS/powerOn/dark.json";
import NanoSPAnimLight from "../assets/animations/nanoSP/powerOn/light.json";
import NanoSPAnimDark from "../assets/animations/nanoSP/powerOn/dark.json";
import NanoXAnimLight from "../assets/animations/nanoX/powerOn/light.json";
import NanoXAnimDark from "../assets/animations/nanoX/powerOn/dark.json";
import { ContentContainer } from "../shared";
import useTheme from "~/renderer/hooks/useTheme";

const animations = {
  nanoX: {
    light: NanoXAnimLight,
    dark: NanoXAnimDark,
  },
  nanoS: {
    light: NanoSAnimLight,
    dark: NanoSAnimDark,
  },
  nanoSP: {
    light: NanoSPAnimLight,
    dark: NanoSPAnimDark,
  },
  blue: {
    light: null,
    dark: null,
  },
};

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
  background: rgba(138, 128, 219, 0.1);
  color: #8a80db;
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
  descr: string,
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
        <Text
          style={{ marginTop: 8 }}
          color="palette.text.shade100"
          ff="Inter|Regular"
          fontSize={4}
          lineHeight="19.5px"
        >
          {descr}
        </Text>
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
    titleKey: "onboarding.screens.tutorial.screens.deviceHowTo.turnOn.title",
    descrKey: "onboarding.screens.tutorial.screens.deviceHowTo.turnOn.descr",
  },
  {
    titleKey: "onboarding.screens.tutorial.screens.deviceHowTo.browse.title",
    descrKey: "onboarding.screens.tutorial.screens.deviceHowTo.browse.descr",
  },
  {
    titleKey: "onboarding.screens.tutorial.screens.deviceHowTo.select.title",
    descrKey: "onboarding.screens.tutorial.screens.deviceHowTo.select.descr",
  },
  {
    titleKey: "onboarding.screens.tutorial.screens.deviceHowTo.follow.title",
    descrKey: "onboarding.screens.tutorial.screens.deviceHowTo.follow.descr",
  },
];

type Props = {
  sendEvent: string => void,
  context: {
    deviceId: DeviceModelId,
  },
};

export function DeviceHowTo({ sendEvent, context }: Props) {
  const { t } = useTranslation();
  const { deviceId } = context;
  const theme = useTheme("colors.palette.type");

  const onClickPrev = useCallback(() => sendEvent("PREV"), [sendEvent]);
  const onClickNext = useCallback(() => sendEvent("NEXT"), [sendEvent]);

  return (
    <ScreenContainer>
      <ContentContainer style={{ marginTop: 94 }}>
        <Animation
          loop
          animation={animations[deviceId][theme]}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
          height="130"
        />
        <StepList>
          {steps.map((step, index) => (
            <Step key={index} title={t(step.titleKey)} descr={t(step.descrKey)} index={index + 1} />
          ))}
        </StepList>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.text.shade30" onClick={onClickPrev}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.deviceHowTo.buttons.prev")}
          </Text>
        </Button>
        <Button data-test-id="device-howto-cta" primary onClick={onClickNext}>
          <Text mr="12px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.deviceHowTo.buttons.next")}
          </Text>
          <ChevronRight size={13} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}

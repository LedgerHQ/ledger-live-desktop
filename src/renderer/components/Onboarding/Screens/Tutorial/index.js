// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Stepper } from "~/renderer/components/Onboarding/Screens/Tutorial/Stepper";
import { ImportYourRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/ImportYourRecoveryPhrase";
import { DeviceHowTo } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/DeviceHowTo";
import { PinCode } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PinCode";
import { PinCodeHowTo } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PinCodeHowTo";
import { useMachine } from "@xstate/react";
import { useRecoveryPhraseMachine } from "~/renderer/components/Onboarding/Screens/Tutorial/machines/useRecoveryPhrase";
import { setupNewDevice } from "~/renderer/components/Onboarding/Screens/Tutorial/machines/setupNewDevice";
import { CSSTransition } from "react-transition-group";
import { ExistingRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/ExistingRecoveryPhrase";
import { RecoveryHowTo2 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/RecoveryHowTo2";
import { RecoveryHowTo1 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/RecoveryHowTo1";
import { PairMyNano } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PairMyNano";
import { SideDrawer } from "~/renderer/components/Onboarding/SideDrawer";
import { PinHelp } from "~/renderer/components/Onboarding/PinHelp";
import { HideRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/HideRecoveryPhrase";
import { WaveContainer } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import { AnimatedWave } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/AnimatedWave";
import { HowToGetStarted } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/HowToGetStarted";

const TutorialContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 288px;
  padding: 164px 40px 0px 40px;
  box-sizing: border-box;
`;

const DURATION = 200;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  background: ${({ bgTheme, theme }) => {
    if (bgTheme === "light") {
      return "rgba(100, 144, 241, 0.1)";
    }
    if (bgTheme === "dark") {
      return theme.colors.palette.primary.main;
    }
    return "none";
  }};

  transition: background ${DURATION} ease-out;
`;

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;

  &.slide-switch-appear {
    opacity: 0;
  }

  &.slide-switch-appear-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease-in;
  }
`;

const screens = {
  howToGetStarted: {
    component: HowToGetStarted,
    bgTheme: "dark",
  },
  importRecoveryPhrase: {
    component: ImportYourRecoveryPhrase,
    bgTheme: "dark",
  },
  deviceHowTo: {
    component: DeviceHowTo,
    bgTheme: "light",
  },
  pinCode: {
    component: PinCode,
    bgTheme: "dark",
  },
  pinCodeHowTo: {
    component: PinCodeHowTo,
    bgTheme: "light",
  },
  existingRecoveryPhrase: {
    component: ExistingRecoveryPhrase,
    bgTheme: "dark",
  },
  recoveryHowTo1: {
    component: RecoveryHowTo1,
    bgTheme: "light",
  },
  recoveryHowTo2: {
    component: RecoveryHowTo2,
    bgTheme: "light",
  },
  hideRecoveryPhrase: {
    component: HideRecoveryPhrase,
    bgTheme: "dark",
  },
  pairMyNano: {
    component: PairMyNano,
    bgTheme: "dark",
  },
};

export function Tutorial() {
  const { t } = useTranslation();
  const [state, sendEvent] = useMachine(setupNewDevice);

  const Screen = screens[state.value].component;
  const theme = screens[state.value].bgTheme;

  return (
    <TutorialContainer>
      <SideDrawer
        isOpen={!!state.context.drawer}
        onRequestClose={() => sendEvent("CLOSE_DRAWER")}
        direction="left"
      >
        <PinHelp />
      </SideDrawer>
      <LeftContainer>
        <Stepper steps={state.context.steps} />
      </LeftContainer>
      <RightContainer bgTheme={theme}>
        <WaveContainer>
          <AnimatedWave height={500} color={theme === "dark" ? "#587ED4" : "#4385F016"} />
        </WaveContainer>
        <CSSTransition in appear key={state.value} timeout={DURATION} classNames="slide-switch">
          <ScreenContainer>
            <Screen sendEvent={sendEvent} context={state.context} />
          </ScreenContainer>
        </CSSTransition>
      </RightContainer>
    </TutorialContainer>
  );
}

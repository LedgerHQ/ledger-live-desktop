// @flow

import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { CSSTransition } from "react-transition-group";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Stepper } from "~/renderer/components/Onboarding/Screens/Tutorial/Stepper";
import { ImportYourRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/ImportYourRecoveryPhrase";
import { DeviceHowTo } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/DeviceHowTo";
import { DeviceHowTo2 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/DeviceHowTo2";
import { PinCode } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PinCode";
import { PinCodeHowTo } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PinCodeHowTo";
import { useRecoveryPhraseMachine } from "~/renderer/components/Onboarding/Screens/Tutorial/machines/useRecoveryPhrase";
import { setupNewDevice } from "~/renderer/components/Onboarding/Screens/Tutorial/machines/setupNewDevice";
import { ExistingRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/ExistingRecoveryPhrase";
import { RecoveryHowTo3 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/RecoveryHowTo3";
import { RecoveryHowTo2 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/RecoveryHowTo2";
import { RecoveryHowTo1 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/RecoveryHowTo1";
import { PairMyNano } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PairMyNano";
import { SideDrawer } from "~/renderer/components/Onboarding/SideDrawer";
import { PinHelp } from "~/renderer/components/Onboarding/Help/PinHelp";
import { HideRecoverySeed } from "~/renderer/components/Onboarding/Help/HideRecoverySeed";
import { RecoverySeed } from "~/renderer/components/Onboarding/Help/RecoverySeed";
import { HideRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/HideRecoveryPhrase";
import { WaveContainer } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import { AnimatedWave } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/AnimatedWave";
import { HowToGetStarted } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/HowToGetStarted";
import { NewRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/NewRecoveryPhrase";
import { GenuineCheck } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/GenuineCheck";
import { Modal } from "~/renderer/components/Onboarding/Modal";
import { CarefullyFollowInstructions } from "~/renderer/components/Onboarding/Alerts/CarefullyFollowInstructions";
import { connectSetupDevice } from "~/renderer/components/Onboarding/Screens/Tutorial/machines/connectSetupDevice";
import { PreferLedgerRecoverySeed } from "~/renderer/components/Onboarding/Alerts/PreferLedgerRecoverySeed";
import { UseRecoverySheet } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/UseRecoverySheet";
import { Quizz } from "~/renderer/components/Onboarding/Quizz";
import { QuizFailure } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/QuizFailure";
import { QuizSuccess } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/QuizSuccess";
import { fireConfetti } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/confetti";

const TutorialContainer: ThemedComponent<*> = styled.div`
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
  deviceHowTo2: {
    component: DeviceHowTo2,
    bgTheme: "light",
  },
  pinCode: {
    component: PinCode,
    bgTheme: "dark",
  },
  genuineCheck: {
    component: GenuineCheck,
    bgTheme: "light",
  },
  pinCodeHowTo: {
    component: PinCodeHowTo,
    bgTheme: "light",
  },
  existingRecoveryPhrase: {
    component: ExistingRecoveryPhrase,
    bgTheme: "dark",
  },
  newRecoveryPhrase: {
    component: NewRecoveryPhrase,
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
  recoveryHowTo3: {
    component: RecoveryHowTo3,
    bgTheme: "light",
  },
  hideRecoveryPhrase: {
    component: HideRecoveryPhrase,
    bgTheme: "dark",
  },
  useRecoverySheet: {
    component: UseRecoverySheet,
    bgTheme: "light",
  },
  pairMyNano: {
    component: PairMyNano,
    bgTheme: "dark",
  },
  quizSuccess: {
    component: QuizSuccess,
    bgTheme: "dark",
  },
  quizFailure: {
    component: QuizFailure,
    bgTheme: "dark",
  },
};

type Props = {
  sendEvent: ({ type: string, [string]: * } | string, *) => void,
  context: *,
};

export function ConnectSetUpDevice({ sendEvent, context }: Props) {
  return (
    <Tutorial sendEventToParent={sendEvent} machine={connectSetupDevice} parentContext={context} />
  );
}

export function SetupNewDevice({ sendEvent, context }: Props) {
  return (
    <Tutorial sendEventToParent={sendEvent} machine={setupNewDevice} parentContext={context} />
  );
}

export function UseRecoveryPhrase({ sendEvent, context }: Props) {
  return (
    <Tutorial
      sendEventToParent={sendEvent}
      machine={useRecoveryPhraseMachine}
      parentContext={context}
    />
  );
}

type TutorialProps = {
  sendEventToParent: ({ type: string, [string]: * } | string, *) => void,
  machine: *,
  parentContext: *,
};

function Tutorial({ sendEventToParent, machine, parentContext }: TutorialProps) {
  const [state, sendEvent] = useMachine(machine, {
    actions: {
      topLevelPrev: () => sendEventToParent("PREV"),
      topLevelNext: () => sendEventToParent("NEXT"),
      fireConfetti,
    },
    context: {
      deviceId: parentContext.deviceId,
    },
  });

  const Screen = screens[state.value].component;
  const theme = screens[state.value].bgTheme;

  return (
    <TutorialContainer>
      <Modal isOpen={state.context.quizzOpen}>
        <Quizz onWin={() => sendEvent("QUIZ_SUCCESS")} onLose={() => sendEvent("QUIZ_FAILURE")} />
      </Modal>
      <Modal isOpen={state.context.alerts.beCareful}>
        <CarefullyFollowInstructions
          onClose={() =>
            sendEvent({ type: "SET_ALERT_STATUS", alertId: "beCareful", status: false })
          }
        />
      </Modal>
      <Modal isOpen={state.context.alerts.preferLedgerSeed}>
        <PreferLedgerRecoverySeed
          onClose={() =>
            sendEvent({ type: "SET_ALERT_STATUS", alertId: "preferLedgerSeed", status: false })
          }
        />
      </Modal>
      <SideDrawer
        isOpen={!!state.context.help.pinCode}
        onRequestClose={() =>
          sendEvent({ type: "SET_HELP_STATUS", helpId: "pinCode", status: false })
        }
        direction="left"
      >
        <PinHelp />
      </SideDrawer>
      <SideDrawer
        isOpen={!!state.context.help.recoveryPhrase}
        onRequestClose={() =>
          sendEvent({ type: "SET_HELP_STATUS", helpId: "recoveryPhrase", status: false })
        }
        direction="left"
      >
        <RecoverySeed />
      </SideDrawer>
      <SideDrawer
        isOpen={!!state.context.help.hideRecoveryPhrase}
        onRequestClose={() =>
          sendEvent({ type: "SET_HELP_STATUS", helpId: "hideRecoveryPhrase", status: false })
        }
        direction="left"
      >
        <HideRecoverySeed />
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

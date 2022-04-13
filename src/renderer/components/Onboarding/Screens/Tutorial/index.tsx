import { Flex, Aside, Logos, Button, Icons, ProgressBar, Drawer, Popin } from "@ledgerhq/react-ui";
import React, { useCallback, useState } from "react";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useParams,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { ImportYourRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/ImportYourRecoveryPhrase";
import { DeviceHowTo } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/DeviceHowTo";
import { DeviceHowTo2 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/DeviceHowTo2";
import { PinCode } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PinCode";
import { PinCodeHowTo } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PinCodeHowTo";
import { ExistingRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/ExistingRecoveryPhrase";
import { RecoveryHowTo3 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/RecoveryHowTo3";
import { RecoveryHowTo2 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/RecoveryHowTo2";
import { RecoveryHowTo1 } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/RecoveryHowTo1";
import { PairMyNano } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PairMyNano";
import { PinHelp } from "~/renderer/components/Onboarding/Help/PinHelp";
import { HideRecoverySeed } from "~/renderer/components/Onboarding/Help/HideRecoverySeed";
import { RecoverySeed } from "~/renderer/components/Onboarding/Help/RecoverySeed";
import { HideRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/HideRecoveryPhrase";
import { HowToGetStarted } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/HowToGetStarted";
import { NewRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/NewRecoveryPhrase";
import { GenuineCheck } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/GenuineCheck";
import { CarefullyFollowInstructions } from "~/renderer/components/Onboarding/Alerts/CarefullyFollowInstructions";
import { PreferLedgerRecoverySeed } from "~/renderer/components/Onboarding/Alerts/PreferLedgerRecoverySeed";
import { UseRecoverySheet } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/UseRecoverySheet";
import { QuizFailure } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/QuizFailure";
import { QuizSuccess } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/QuizSuccess";
import { fireConfetti } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/confetti";
import RecoveryWarning from "../../Help/RecoveryWarning";
import { QuizzPopin } from "~/renderer/modals/OnboardingQuizz/OnboardingQuizzModal";

import { UseCase, useCaseSelector } from "~/renderer/reducers/onboarding";

import { track } from "~/renderer/analytics/segment";

const FlowStepperContainer = styled(Flex)`
  width: 100%;
  height: 100%;
`;

const FlowStepperContentContainer = styled(Flex)`
  height: 100%;
  padding: ${p => p.theme.space[10]}px;
`;

const FlowStepperContent = styled(Flex)`
  width: 514px;
  height: 100%;
`;

const StepContent = styled.div`
  flex-grow: 1;
  margin-top: ${p => p.theme.space[10]}px;
  margin-bottom: ${p => p.theme.space[10]}px;
  width: 100%;
`;

type FlowStepperProps = {
  illustration?: React.ReactNode;
  content?: React.ReactNode;
  AsideFooter?: React.ReactNode;
  ProgressBar?: React.ReactNode;
  key: string;
  continueLabel?: string;
  backLabel?: string;
  disableContinue?: boolean;
  disableBack?: boolean;
  children: React.ReactNode;
  handleBack: () => void;
  handleContinue: () => void;
};

const FooterContainer = styled(Flex).attrs({ rowGap: 3, height: 120 })`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const FlowStepper: React.FC<FlowStepperProps> = ({
  illustration,
  AsideFooter,
  continueLabel,
  backLabel,
  disableContinue,
  disableBack,
  ProgressBar,
  children,
  handleBack,
  handleContinue,
}) => {
  const handleHelp = useCallback(() => {
    // sendEvent("HELP");
  }, []);

  const { t } = useTranslation();

  const Footer = (
    <FooterContainer>{AsideFooter ? <AsideFooter onClick={handleHelp} /> : null}</FooterContainer>
  );

  return (
    <FlowStepperContainer>
      <Aside
        backgroundColor="palette.primary.c60"
        header={
          <Flex justifyContent="center">
            <Logos.LedgerLiveRegular />
          </Flex>
        }
        footer={Footer}
        width="324px"
        p={10}
        position="relative"
      >
        {illustration}
      </Aside>
      <FlowStepperContentContainer flexGrow={1} justifyContent="center">
        <FlowStepperContent flexDirection="column">
          {ProgressBar}
          <StepContent>{children}</StepContent>
          <Flex justifyContent="space-between">
            <Button
              iconPosition="left"
              onClick={handleBack}
              disabled={disableBack}
              variant="main"
              outline
              Icon={() => <Icons.ArrowLeftMedium size={18} />}
            >
              {backLabel || t("common.back")}
            </Button>
            <Button
              onClick={handleContinue}
              disabled={disableContinue}
              variant="main"
              Icon={() => <Icons.ArrowRightMedium size={18} />}
            >
              {continueLabel || t("common.continue")}
            </Button>
          </Flex>
        </FlowStepperContent>
      </FlowStepperContentContainer>
    </FlowStepperContainer>
  );
};

export enum ScreenId {
  howToGetStarted = "how-to-get-started",
  deviceHowTo = "device-how-to",
  deviceHowTo2 = "device-how-to-2",
  pinCode = "pin-code",
  pinCodeHowTo = "pin-code-how-to",
  newRecoveryPhrase = "new-recovery-phrase",
  useRecoverySheet = "use-recovery-sheet",
  recoveryHowTo = "recovery-how-to",
  recoveryHowTo2 = "recovery-how-to-2",
  recoveryHowTo3 = "recovery-how-to-3",
  hideRecoveryPhrase = "hide-recovery-phrase",
  importYourRecoveryPhrase = "import-your-recovery-phrase",
  existingRecoveryPhrase = "existing-recovery-phrase",
  quizSuccess = "quiz-success",
  quizFailure = "quiz-failure",
  pairMyNano = "pair-my-nano",
  genuineCheck = "genuine-check",
}

interface IScreen {
  id: ScreenId;
  component: React.ComponentType;
  useCases?: UseCase[];
  next: () => void;
  previous: () => void;
  canContinue?: boolean;
}

export default function Tutorial() {
  const history = useHistory();
  const [quizzOpen, setQuizOpen] = useState(false);
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const useCase = useSelector(useCaseSelector);

  const urlSplit = pathname.split("/");
  const currentStep = urlSplit[urlSplit.length - 1];
  const path = urlSplit.slice(0, urlSplit.length - 1).join("/");

  const screens: IScreen[] = [
    {
      id: ScreenId.howToGetStarted,
      component: HowToGetStarted,
      useCases: [UseCase.setupDevice],
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Get started step 1");
        }
        history.push(`${path}/${ScreenId.deviceHowTo}`);
      },
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: ScreenId.deviceHowTo,
      component: DeviceHowTo,
      next: () => history.push(`${path}/${ScreenId.pinCode}`),
      previous: () => history.push(`${path}/${ScreenId.howToGetStarted}`),
    },
    {
      id: ScreenId.deviceHowTo2,
      component: DeviceHowTo2,
      next: () => history.push(`${path}/${ScreenId.deviceHowTo2}`),
      previous: () => history.push(`${path}/${ScreenId.howToGetStarted}`),
    },
    {
      id: ScreenId.pinCode,
      component: PinCode,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Pin code step 1");
        }
        history.push(`${path}/${ScreenId.pinCodeHowTo}`);
      },
      previous: () => history.push(`${path}/${ScreenId.deviceHowTo}`),
    },
    {
      id: ScreenId.pinCodeHowTo,
      component: PinCodeHowTo,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Pin code step 2");
        }
        history.push(`${path}/${ScreenId.newRecoveryPhrase}`);
      },
      previous: () => history.push(`${path}/${ScreenId.pinCode}`),
    },
    {
      id: ScreenId.newRecoveryPhrase,
      component: NewRecoveryPhrase,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Recovery step 1");
        }
        history.push(`${path}/${ScreenId.useRecoverySheet}`);
      },
      previous: () => history.push(`${path}/${ScreenId.pinCodeHowTo}`),
    },
    {
      id: ScreenId.useRecoverySheet,
      component: UseRecoverySheet,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Recovery step 2");
        }
        history.push(`${path}/${ScreenId.recoveryHowTo3}`);
      },
      previous: () => history.push(`${path}/${ScreenId.newRecoveryPhrase}`),
    },
    {
      id: ScreenId.recoveryHowTo,
      component: RecoveryHowTo1,
      next: () => history.push(`${path}/${ScreenId.deviceHowTo2}`),
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: ScreenId.recoveryHowTo2,
      component: RecoveryHowTo2,
      next: () => history.push(`${path}/${ScreenId.deviceHowTo2}`),
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: ScreenId.recoveryHowTo3,
      component: RecoveryHowTo3,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Recovery step 3");
        }
        history.push(`${path}/${ScreenId.hideRecoveryPhrase}`);
      },
      previous: () => history.push(`${path}/${ScreenId.useRecoverySheet}`),
    },
    {
      id: ScreenId.hideRecoveryPhrase,
      component: HideRecoveryPhrase,
      useCases: [UseCase.connectDevice, UseCase.setupDevice],
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Recovery step 4");
          setQuizOpen(true);
        }
        history.push(`${path}/${ScreenId.hideRecoveryPhrase}`);
      },
      previous: () => history.push(`${path}/${ScreenId.recoveryHowTo3}`),
    },

    {
      id: ScreenId.importYourRecoveryPhrase,
      component: ImportYourRecoveryPhrase,
      next: () => history.push(`${path}/${ScreenId.deviceHowTo2}`),
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: ScreenId.existingRecoveryPhrase,
      component: ExistingRecoveryPhrase,
      next: () => history.push(`${path}/${ScreenId.deviceHowTo2}`),
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: ScreenId.quizSuccess,
      component: QuizSuccess,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Pair start");
        }
        history.push(`${path}/${ScreenId.pairMyNano}`);
      },
      previous: () => history.push(`${path}/${ScreenId.hideRecoveryPhrase}`),
    },
    {
      id: ScreenId.quizFailure,
      component: QuizFailure,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Pair start");
        }
        history.push(`${path}/${ScreenId.pairMyNano}`);
      },
      previous: () => history.push(`${path}/${ScreenId.hideRecoveryPhrase}`),
    },
    {
      id: ScreenId.pairMyNano,
      component: PairMyNano,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Genuine Check");
        }
        history.push(`${path}/${ScreenId.genuineCheck}`);
      },
      previous: () => history.push(`${path}/${ScreenId.hideRecoveryPhrase}`),
    },
    {
      id: ScreenId.genuineCheck,
      component: GenuineCheck,
      next: () => history.push("/"),
      previous: () => history.push(`${path}/${ScreenId.pairMyNano}`),
    },
  ];

  const steps = [
    {
      name: "getStarted",
      screens: [
        ScreenId.howToGetStarted,
        ScreenId.deviceHowTo,
        ScreenId.deviceHowTo2,
        ScreenId.importYourRecoveryPhrase,
      ],
    },
    {
      name: "pinCode",
      screens: [ScreenId.pinCode, ScreenId.pinCodeHowTo],
    },
    {
      name: "recoveryPhrase",
      screens: [
        ScreenId.newRecoveryPhrase,
        ScreenId.useRecoverySheet,
        ScreenId.existingRecoveryPhrase,
        ScreenId.recoveryHowTo,
        ScreenId.recoveryHowTo2,
        ScreenId.recoveryHowTo3,
      ],
    },
    {
      name: "hideRecoveryPhrase",
      screens: [ScreenId.hideRecoveryPhrase, ScreenId.quizSuccess, ScreenId.quizFailure],
    },
    {
      name: "pairNano",
      screens: [ScreenId.pairMyNano, ScreenId.genuineCheck],
    },
  ];

  if (useCase === UseCase.recoveryPhrase) {
    // Remove step : hideRecoveryPhrase
    steps.splice(3, 1);
  }

  const stepsStatus: { [key: string]: "success" | "active" | "inactive" } = {};
  const currentScreenIndex = screens.findIndex(s => s.id === currentStep);
  const { component: CurrentScreen, canContinue, next, previous, id: currentScreenId } = screens[
    currentScreenIndex
  ];
  const screenStepIndex = steps.findIndex(
    s => !!s.screens.find(screenId => screenId === currentScreenId),
  );

  steps.forEach((step, stepIndex) => {
    let status: "success" | "active" | "inactive";

    if (screenStepIndex > stepIndex) {
      status = "success";
    } else if (screenStepIndex < stepIndex) {
      status = "inactive";
    } else {
      status = "active";
    }
    stepsStatus[step.name] = status;
  });

  const useCaseScreens = screens.filter(screen => {
    return !screen.useCases || screen.useCases.includes(useCase);
  });

  const progressSteps = steps.map(({ name }) => ({
    key: name,
    label: t(`onboarding.screens.tutorial.steps.${name}`),
  }));

  const quizSucceeds = () => {
    setQuizOpen(false);
    history.push(`${path}/quiz-success`);
  };

  const quizFails = () => {
    setQuizOpen(false);
    history.push(`${path}/quiz-failure`);
  };

  return (
    <>
      <QuizzPopin isOpen={quizzOpen} onWin={quizSucceeds} onLose={quizFails} onClose={quizFails} />
      <FlowStepper
        illustration={CurrentScreen.Illustration}
        AsideFooter={CurrentScreen.Footer}
        disableContinue={canContinue === false}
        ProgressBar={<ProgressBar steps={progressSteps} currentIndex={screenStepIndex} />}
        continueLabel={CurrentScreen.continueLabel}
        handleContinue={next}
        handleBack={previous}
      >
        <Switch>
          {/* <Route exact path="/onboarding/setup-device">
            <Redirect push to={`${path}/how-to-get-started`} />
          </Route>
          <Route exact path="/onboarding/connect-device">
            <Redirect push to={`${path}/${ScreenId.pairMyNano}`} />
          </Route>
          <Route exact path="/onboarding/recovery-phrase">
            <Redirect push to={`${path}/import-your-recovery-phrase`} />
          </Route> */}
          {useCaseScreens.map(({ component: Screen, id }) => {
            // TODO : remove this!!!
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (
              <Route key={id} path={`${path}/${id}`} render={props => <Screen {...props} />} />
            );
          })}
        </Switch>
      </FlowStepper>
    </>
  );
}

// function OldTutorial({ sendEventToParent, machine, component }) {
//   const { t } = useTranslation();
//   const [state, sendEvent] = useMachine(machine, {
//     actions: {
//       topLevelPrev: () => sendEventToParent("PREV"),
//       topLevelNext: () => sendEventToParent("NEXT"),
//       fireConfetti,
//     },
//   });

//   const Screen = component || screens[state.value].component;

//   const steps = state.context.steps.map(({ id }) => ({
//     key: id,
//     label: t(`onboarding.screens.tutorial.steps.${id}`),
//   }));
//   const currentIndex = state.context.steps.findIndex(({ status }) => status === "active");

//   return (
//     <>
//       <QuizzPopin
//         isOpen={state.context.quizzOpen}
//         onWin={() => {
//           sendEvent("QUIZ_SUCCESS");
//         }}
//         onLose={() => {
//           sendEvent("QUIZ_FAILURE");
//         }}
//         onClose={() => {
//           sendEvent("QUIZ_FAILURE");
//         }}
//       />
//       <Popin isOpen={state.context.alerts.beCareful}>
//         <CarefullyFollowInstructions
//           onClose={() =>
//             sendEvent({ type: "SET_ALERT_STATUS", alertId: "beCareful", status: false })
//           }
//         />
//       </Popin>
//       <Popin isOpen={state.context.alerts.preferLedgerSeed}>
//         <PreferLedgerRecoverySeed
//           onClose={() =>
//             sendEvent({ type: "SET_ALERT_STATUS", alertId: "preferLedgerSeed", status: false })
//           }
//         />
//       </Popin>
//       <Drawer
//         isOpen={!!state.context.help.pinCode}
//         onClose={() => sendEvent({ type: "SET_HELP_STATUS", helpId: "pinCode", status: false })}
//         direction="left"
//       >
//         <Flex px={40}>
//           <PinHelp />
//         </Flex>
//       </Drawer>
//       <Drawer
//         isOpen={!!state.context.help.recoveryPhrase}
//         onClose={() =>
//           sendEvent({ type: "SET_HELP_STATUS", helpId: "recoveryPhrase", status: false })
//         }
//         direction="left"
//       >
//         <Flex px={40}>
//           <RecoverySeed />
//         </Flex>
//       </Drawer>
//       <Drawer
//         isOpen={!!state.context.help.hideRecoveryPhrase}
//         onClose={() =>
//           sendEvent({ type: "SET_HELP_STATUS", helpId: "hideRecoveryPhrase", status: false })
//         }
//         direction="left"
//       >
//         <Flex px={40}>
//           <HideRecoverySeed />
//         </Flex>
//       </Drawer>
//       <Drawer
//         isOpen={!!state.context.help.recoveryPhraseWarning}
//         onClose={() =>
//           sendEvent({ type: "SET_HELP_STATUS", helpId: "recoveryPhraseWarning", status: false })
//         }
//         direction="left"
//       >
//         <Flex px={40}>
//           <RecoveryWarning />
//         </Flex>
//       </Drawer>

//       {!!Screen && (
//         <FlowStepper
//           illustration={Screen.Illustration}
//           AsideFooter={Screen.Footer}
//           sendEvent={sendEvent}
//           disableContinue={Screen.canContinue ? !Screen.canContinue(state.context) : false}
//           ProgressBar={<ProgressBar steps={steps} currentIndex={currentIndex} />}
//           continueLabel={Screen.continueLabel}
//           onContinue={Screen.onContinue ? () => Screen.onContinue(sendEvent) : null}
//         >
//           <Screen sendEvent={sendEvent} context={state.context} />
//         </FlowStepper>
//       )}
//     </>
//   );
// }

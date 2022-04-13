import { Flex, Aside, Logos, Button, Icons, ProgressBar, Drawer, Popin } from "@ledgerhq/react-ui";
import { DeviceModelId } from "@ledgerhq/devices";
import React, { useCallback } from "react";
import { Switch, Route, Redirect, useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
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
import {
  PairMyNano,
  PairMyNanoProps,
} from "~/renderer/components/Onboarding/Screens/Tutorial/screens/PairMyNano";
import { PinHelp } from "~/renderer/components/Onboarding/Help/PinHelp";
import { HideRecoverySeed } from "~/renderer/components/Onboarding/Help/HideRecoverySeed";
import { RecoverySeed } from "~/renderer/components/Onboarding/Help/RecoverySeed";
import { HideRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/HideRecoveryPhrase";
import { HowToGetStarted } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/HowToGetStarted";
import { NewRecoveryPhrase } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/NewRecoveryPhrase";
import {
  GenuineCheck,
  GenuineCheckProps,
} from "~/renderer/components/Onboarding/Screens/Tutorial/screens/GenuineCheck";
import { CarefullyFollowInstructions } from "~/renderer/components/Onboarding/Alerts/CarefullyFollowInstructions";
import { connectSetupDevice } from "~/renderer/components/Onboarding/Screens/Tutorial/machines/connectSetupDevice";
import { PreferLedgerRecoverySeed } from "~/renderer/components/Onboarding/Alerts/PreferLedgerRecoverySeed";
import { UseRecoverySheet } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/UseRecoverySheet";
import { QuizFailure } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/QuizFailure";
import { QuizSuccess } from "~/renderer/components/Onboarding/Screens/Tutorial/screens/QuizSuccess";
import { fireConfetti } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/confetti";
import RecoveryWarning from "../../Help/RecoveryWarning";
import { QuizzPopin } from "~/renderer/modals/OnboardingQuizz/OnboardingQuizzModal";

import { deviceModelIdSelector, UseCase, useCaseSelector } from "~/renderer/reducers/onboarding";

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
  sendEvent,
  onContinue,
  ProgressBar,
  children,
}) => {
  const history = useHistory();

  const handleBack = useCallback(() => {
    history.push("/onboarding/select-use-case");
  }, [history]);

  const handleContinue = useCallback(() => {
    if (onContinue) onContinue();
  }, [onContinue]);

  const handleHelp = useCallback(() => {
    sendEvent("HELP");
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
              {backLabel ?? t("common.back")}
            </Button>
            <Button
              onClick={handleContinue}
              disabled={disableContinue}
              variant="main"
              Icon={() => <Icons.ArrowRightMedium size={18} />}
            >
              {continueLabel ?? t("common.continue")}
            </Button>
          </Flex>
        </FlowStepperContent>
      </FlowStepperContentContainer>
    </FlowStepperContainer>
  );
};

  genuineCheck = "genuine-check",
}

interface IScreen {
  id: string;
  component: React.ComponentType;
  useCases?: UseCase[];
  next: () => void;
  previous: () => void;
}

function BigTutorial() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [quizzOpen, setQuizOpen] = useState(false);
  const { t } = useTranslation();
  const { url } = useRouteMatch();

  const useCase = useSelector(useCaseSelector);

  const urlSplit = url.split("/");
  const currentStep = urlSplit[urlSplit.length - 1] as UseCase;
  const path = urlSplit.slice(0, urlSplit.length - 1).join("/");

  const screens: IScreen[] = [
    {
      id: "how-to-get-started",
      component: HowToGetStarted,
      useCases: [UseCase.setupDevice],
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Get started step 1");
        }
        history.push(`${path}/device-how-to`);
      },
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: "device-how-to",
      component: DeviceHowTo,
      next: () => history.push(`${path}/pin-code`),
      previous: () => history.push(`${path}/how-to-get-started`),
    },
    {
      id: "device-how-to-2",
      component: DeviceHowTo2,
      next: () => history.push(`${path}/device-how-to-2`),
      previous: () => history.push(`${path}/how-to-get-started`),
    },
    {
      id: "pin-code",
      component: PinCode,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Pin code step 1");
        }
        history.push(`${path}/pin-code-how-to`);
      },
      previous: () => history.push(`${path}/device-how-to`),
    },
    {
      id: "pin-code-how-to",
      component: PinCodeHowTo,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Pin code step 2");
        }
        history.push(`${path}/new-recovery-phrase`);
      },
      previous: () => history.push(`${path}/pin-code`),
    },
    {
      id: "new-recovery-phrase",
      component: NewRecoveryPhrase,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Recovery step 1");
        }
        history.push(`${path}/use-recovery-sheet`);
      },
      previous: () => history.push(`${path}/pin-code-how-to`),
    },
    {
      id: "use-recovery-sheet",
      component: UseRecoverySheet,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Recovery step 2");
        }
        history.push(`${path}/recovery-how-to-3`);
      },
      previous: () => history.push(`${path}/new-recovery-phrase`),
    },
    {
      id: "recovery-how-to",
      component: RecoveryHowTo1,
      next: () => history.push(`${path}/device-how-to-2`),
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: "recovery-how-to-2",
      component: RecoveryHowTo2,
      next: () => history.push(`${path}/device-how-to-2`),
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: "recovery-how-to-3",
      component: RecoveryHowTo3,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Recovery step 3");
        }
        history.push(`${path}/hide-recovery-phrase`);
      },
      previous: () => history.push(`${path}/use-recovery-sheet`),
    },
    {
      id: "hide-recovery-phrase",
      component: HideRecoveryPhrase,
      useCases: [UseCase.connectDevice, UseCase.setupDevice],
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Recovery step 4");
          setQuizOpen(true);
        }
        history.push(`${path}/hide-recovery-phrase`);
      },
      previous: () => history.push(`${path}/recovery-how-to-3`),
    },

    {
      id: "import-your-recovery-phrase",
      component: ImportYourRecoveryPhrase,
      next: () => history.push(`${path}/device-how-to-2`),
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: "existing-recovery-phrase",
      component: ExistingRecoveryPhrase,
      next: () => history.push(`${path}/device-how-to-2`),
      previous: () => history.push("/onboarding/select-use-case"),
    },
    {
      id: "quiz-success",
      component: QuizSuccess,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Pair start");
        }
        history.push(`${path}/pair-my-nano`);
      },
      previous: () => history.push(`${path}/hide-recovery-phrase`),
    },
    {
      id: "quiz-failure",
      component: QuizFailure,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Pair start");
        }
        history.push(`${path}/pair-my-nano`);
      },
      previous: () => history.push(`${path}/hide-recovery-phrase`),
    },
    {
      id: "pair-my-nano",
      component: PairMyNano,
      next: () => {
        if (useCase === UseCase.setupDevice) {
          track("Onboarding - Genuine Check");
        }
        history.push(`${path}/genuine-check`);
      },
      previous: () => history.push(`${path}/hide-recovery-phrase`),
    },
    {
      id: "genuine-check",
      component: GenuineCheck,
      next: () => history.push("/"),
      previous: () => history.push(`${path}/pair-my-nano`),
    },
  ];

  const steps = [
    {
      start: "how-to-get-started",
      end: "import-your-recovery-phrase",
      name: "getStarted",
    },
    {
      start: "how-to-get-started",
      end: "import-your-recovery-phrase",
      name: "pinCode",
    },
  ];

  const stepsStatus: { [key: string]: "success" | "active" | "inactive" } = {};
  const currentScreenIndex = screens.findIndex(s => s.id === currentStep);
  const { component: CurrentScreen, canContinue, onContinue } = screens[currentScreenIndex];

  steps.forEach(step => {
    const startIndex = screens.findIndex(s => s.id === step.start);
    const endIndex = screens.findIndex(s => s.id === step.end);

    let status: "success" | "active" | "inactive";

    if (currentScreenIndex > endIndex) {
      status = "success";
    } else if (currentScreenIndex < startIndex) {
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

  const activeIndex = steps.findIndex(step => {
    const startIndex = screens.findIndex(s => s.id === step.start);
    const endIndex = screens.findIndex(s => s.id === step.end);

    return currentScreenIndex <= endIndex && currentScreenIndex >= startIndex;
  });

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
        disableContinue={
          CurrentScreen.canContinue ? !CurrentScreen.canContinue(state.context) : false
        }
        ProgressBar={<ProgressBar steps={progressSteps} currentIndex={activeIndex} />}
        continueLabel={CurrentScreen.continueLabel}
        onContinue={CurrentScreen.onContinue ? () => CurrentScreen.onContinue(sendEvent) : null}
      >
        <Switch>
          <Route exact path="/onboarding/setup-device">
            <Redirect to={`${url}/pair-my-nano`} />
          </Route>
          <Route exact path="/onboarding/connect-device">
            <Redirect to={`${url}/pair-my-nano`} />
          </Route>
          <Route exact path="/onboarding/recovery-phrase">
            <Redirect to={`${url}/pair-my-nano`} />
          </Route>
          {useCaseScreens.map(({ component: Screen, id }) => {
            // TODO : remove this!!!
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return <Route key={id} path={`${url}/${id}`} render={props => <Screen {...props} />} />;
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

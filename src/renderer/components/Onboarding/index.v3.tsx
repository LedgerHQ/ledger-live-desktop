// @flow

import { DeviceModelId } from "@ledgerhq/devices";
import React, { useEffect, useState, createContext } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { useMachine } from "@xstate/react";
import { assign, Machine } from "xstate";
import { CSSTransition } from "react-transition-group";
import { saveSettings } from "~/renderer/actions/settings";
import { useDispatch } from "react-redux";
import { relaunchOnboarding } from "~/renderer/actions/application";
import { track } from "~/renderer/analytics/segment";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

// screens
import { Welcome } from "~/renderer/components/Onboarding/Screens/Welcome";
import { Terms } from "~/renderer/components/Onboarding/Screens/Terms";
import { SelectDevice } from "~/renderer/components/Onboarding/Screens/SelectDevice";
import { SelectUseCase } from "~/renderer/components/Onboarding/Screens/SelectUseCase";
import Tutorial from "~/renderer/components/Onboarding/Screens/Tutorial";

import { pedagogyMachine } from "~/renderer/components/Onboarding/Pedagogy/state";

import styled from "styled-components";
import { Pedagogy } from "~/renderer/components/Onboarding/Pedagogy";
import RecoveryWarning from "~/renderer/components/Onboarding/Help/RecoveryWarning";
import { preloadAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { SideDrawer } from "../SideDrawer";
import Box from "../Box";
import TermsAndConditionsModal from "./Screens/Welcome/TermsAndConditionsModal";

const OnboardingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;

const onboardingMachine = Machine({
  id: "onboarding",
  initial: "welcome",
  context: {
    help: {
      recoveryPhraseWarning: false,
    },
  },
  states: {
    welcome: {
      on: {
        NEXT: {
          actions: [
            () => track("Onboarding - Start"),
            assign({
              showTerms: false,
            }),
          ],
          target: "selectDevice",
        },
        PREV: { target: "onboardingComplete" },
        OPEN_TERMS_MODAL: {
          actions: [
            assign({
              showTerms: true,
            }),
          ],
        },
        CLOSE_TERMS_MODAL: {
          actions: [
            assign({
              showTerms: false,
            }),
          ],
        },
      },
    },
    terms: {
      on: {
        NEXT: { target: "selectDevice" },
        PREV: { target: "welcome" },
      },
    },
    selectDevice: {
      on: {
        DEVICE_SELECTED: {
          target: "selectUseCase",
          cond: (_, { deviceId }) => !!deviceId,
          actions: [
            assign((_, { deviceId }) => ({
              deviceId,
            })),
            (_, { deviceId }) => track("Onboarding Device - Selection", { deviceId }),
          ],
        },
        PREV: {
          target: "welcome",
        },
      },
    },
    selectUseCase: {
      invoke: {
        id: "modal",
        src: pedagogyMachine,
      },
      on: {
        OPEN_PEDAGOGY_MODAL: {
          actions: [
            assign({
              pedagogy: true,
            }),
            () => track("Onboarding - Setup new"),
          ],
        },
        CLOSE_PEDAGOGY_MODAL: {
          actions: assign({
            pedagogy: false,
          }),
        },
        USE_RECOVERY_PHRASE: {
          target: "useRecoveryPhrase",
          actions: () => track("Onboarding - Restore"),
        },
        SETUP_NEW_DEVICE: {
          target: "setupNewDevice",
          actions: assign({
            pedagogy: false,
          }),
        },
        CONNECT_SETUP_DEVICE: {
          target: "connectSetupDevice",
          actions: () => track("Onboarding - Connect"),
        },
        PREV: {
          target: "selectDevice",
        },
        RECOVERY_WARN: {
          actions: () => openURL(urls.faq),
        },
      },
    },
    setupNewDevice: {
      on: {
        PREV: {
          target: "selectUseCase",
        },
        NEXT: {
          target: "onboardingComplete",
          actions: () => track("Onboarding - End"),
        },
      },
    },
    connectSetupDevice: {
      on: {
        PREV: {
          target: "selectUseCase",
        },
        NEXT: {
          target: "onboardingComplete",
          actions: () => track("Onboarding - End"),
        },
      },
    },
    useRecoveryPhrase: {
      on: {
        PREV: {
          target: "selectUseCase",
        },
        NEXT: {
          target: "onboardingComplete",
          actions: () => track("Onboarding - End"),
        },
      },
    },
    onboardingComplete: {
      entry: "onboardingCompleted",
      type: "final",
    },
  },
  on: {
    SET_HELP_STATUS: {
      actions: assign((context, { helpId, status }) => ({
        ...context,
        help: {
          ...context.alerts,
          [helpId]: status,
        },
      })),
    },
  },
});

const DURATION = 200;

const ScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  &.page-switch-appear {
    opacity: 0;
  }

  &.page-switch-appear-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease-in;
  }
`;

export enum UseCase {
  setupDevice = "setup-device",
  connectDevice = "connect-device",
  recoveryPhrase = "recovery-phrase",
}

type OnboardingContextTypes = {
  deviceModelId: DeviceModelId | null;
  setDeviceModelId: (deviceModelId: DeviceModelId | null) => void;
};

export const OnboardingContext = createContext<OnboardingContextTypes>({
  deviceModelId: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDeviceModelId: () => {},
});

export function Onboarding() {
  const dispatch = useDispatch();
  const [imgsLoaded, setImgsLoaded] = useState(false);
  const [useCase, setUseCase] = useState(null);
  const [deviceModelId, setDeviceModelId] = useState(null);
  const [openedPedagogyModal, setOpenedPedagogyModal] = useState(false);
  const [openedTermsModal, setOpenedTermsModal] = useState(false);
  const [openedRecoveryPhraseWarningHelp, setOpenedRecoveryPhraseWarningHelp] = useState(false);
  const { path } = useRouteMatch();

  const [state, sendEvent, service] = useMachine(onboardingMachine, {
    actions: {
      onboardingCompleted: () => {
        dispatch(saveSettings({ hasCompletedOnboarding: true }));
        dispatch(relaunchOnboarding(false));
      },
    },
  });

  useEffect(() => {
    const subscription = service.subscribe(state => {
      if (state.changed) {
        console.log("SERVICE: ", state.toStrings(), state);
      }
    });

    return subscription.unsubscribe;
  }, [service]);

  useEffect(() => {
    preloadAssets().then(() => setImgsLoaded(true));
  }, []);

  return (
    <OnboardingContext.Provider value={{ deviceModelId, setDeviceModelId }}>
      <Pedagogy
        isOpen={openedPedagogyModal}
        onClose={() => {
          setOpenedPedagogyModal(false);
        }}
        onDone={() => {
          setOpenedPedagogyModal(false);
        }}
      />
      <TermsAndConditionsModal
        isOpen={openedTermsModal}
        onClose={() => {
          setOpenedTermsModal(false);
        }}
        setOpenedTermsModal={setOpenedTermsModal}
      />
      <SideDrawer
        isOpen={openedRecoveryPhraseWarningHelp}
        onRequestClose={() => {
          setOpenedRecoveryPhraseWarningHelp(false);
        }}
        direction="left"
      >
        <Box px={40}>
          <RecoveryWarning />
        </Box>
      </SideDrawer>
      <OnboardingContainer className={imgsLoaded ? "onboarding-imgs-loaded" : ""}>
        <CSSTransition in appear key={state.value} timeout={DURATION} classNames="page-switch">
          <ScreenContainer>
            <Switch>
              <Route exact path={path} component={Welcome} />
              <Route path={`${path}/welcome`} component={Welcome} />
              <Route path={`${path}/terms`} component={Terms} />
              <Route path={`${path}/select-device`} component={SelectDevice} />
              <Route
                path={`${path}/select-use-case`}
                render={props => {
                  return <SelectUseCase {...props} setUseCase={setUseCase} />;
                }}
              />
              <Route
                path={[
                  `${path}/${UseCase.setupDevice}`,
                  `${path}/${UseCase.connectDevice}`,
                  `${path}/${UseCase.recoveryPhrase}`,
                ]}
                render={props => <Tutorial {...props} useCase={useCase} />}
              />
            </Switch>
          </ScreenContainer>
        </CSSTransition>
      </OnboardingContainer>
    </OnboardingContext.Provider>
  );
}

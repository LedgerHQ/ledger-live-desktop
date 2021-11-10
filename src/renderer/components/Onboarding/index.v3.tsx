// @flow

import React, { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { assign, Machine } from "xstate";
import { CSSTransition } from "react-transition-group";
import { Modal } from "~/renderer/components/Onboarding/Modal";
import { saveSettings } from "~/renderer/actions/settings";
import { useDispatch } from "react-redux";
import { relaunchOnboarding } from "~/renderer/actions/onboarding";
import { track } from "~/renderer/analytics/segment";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

// screens
import { Welcome } from "~/renderer/components/Onboarding/Screens/Welcome";
import { Terms } from "~/renderer/components/Onboarding/Screens/Terms";
import { SelectDevice } from "~/renderer/components/Onboarding/Screens/SelectDevice";
import { SelectUseCase } from "~/renderer/components/Onboarding/Screens/SelectUseCase";
import {
  SetupNewDevice,
  ConnectSetUpDevice,
  UseRecoveryPhrase,
} from "~/renderer/components/Onboarding/Screens/Tutorial";

import { pedagogyMachine } from "~/renderer/components/Onboarding/Pedagogy/state";

import styled from "styled-components";
import { Pedagogy } from "~/renderer/components/Onboarding/Pedagogy";
import RecoveryWarning from "~/renderer/components/Onboarding/Help/RecoveryWarning";
import { preloadAssets } from "~/renderer/components/Onboarding/preloadAssets";
import { SideDrawer } from "../SideDrawer";
import Box from "../Box";

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
          actions: () => track("Onboarding - Start"),
          target: "terms",
        },
        PREV: { target: "onboardingComplete" },
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
          target: "terms",
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

const screens = {
  welcome: Welcome,
  terms: Terms,
  selectDevice: SelectDevice,
  selectUseCase: SelectUseCase,
  setupNewDevice: SetupNewDevice,
  connectSetupDevice: ConnectSetUpDevice,
  useRecoveryPhrase: UseRecoveryPhrase,
};

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

export function Onboarding({ onboardingRelaunched }: { onboardingRelaunched: boolean }) {
  const dispatch = useDispatch();
  const [imgsLoaded, setImgsLoaded] = useState(false);

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

  const CurrentScreen = screens[state.value];

  return (
    <React.Fragment>
      <Modal
        isOpen={state.context.pedagogy}
        onRequestClose={() => sendEvent("CLOSE_PEDAGOGY_MODAL")}
      >
        <Pedagogy onDone={() => sendEvent("SETUP_NEW_DEVICE")} />
      </Modal>
      <SideDrawer
        isOpen={!!state.context.help.recoveryPhraseWarning}
        onRequestClose={() =>
          sendEvent({ type: "SET_HELP_STATUS", helpId: "recoveryPhraseWarning", status: false })
        }
        direction="left"
      >
        <Box px={40}>
          <RecoveryWarning />
        </Box>
      </SideDrawer>
      <OnboardingContainer className={imgsLoaded ? "onboarding-imgs-loaded" : ""}>
        <CSSTransition in appear key={state.value} timeout={DURATION} classNames="page-switch">
          <ScreenContainer>
            <CurrentScreen
              sendEvent={sendEvent}
              context={state.context}
              onboardingRelaunched={onboardingRelaunched}
            />
          </ScreenContainer>
        </CSSTransition>
      </OnboardingContainer>
    </React.Fragment>
  );
}

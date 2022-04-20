// @flow

import React, { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { assign, Machine } from "xstate";
import { CSSTransition } from "react-transition-group";
import { Modal } from "~/renderer/components/Onboarding/Modal";
import { saveSettings } from "~/renderer/actions/settings";
import { useSelector, useDispatch } from "react-redux";
import { relaunchOnboarding } from "~/renderer/actions/onboarding";
import { notSeededDeviceRelaunchSelector } from "~/renderer/reducers/application";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { setNotSeededDeviceRelaunch } from "~/renderer/actions/application";
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

function LedgerLogo() {
  return (
    <svg
      width="99"
      height="26"
      viewBox="0 0 383 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M327.262 119.94V127.998H382.57V91.6548H374.511V119.94H327.262ZM327.262 0V8.05844H374.511V36.3452H382.57V0H327.262ZM298.74 62.3411V43.6158H311.382C317.546 43.6158 319.758 45.6696 319.758 51.2803V54.5982C319.758 60.3657 317.624 62.3411 311.382 62.3411H298.74ZM318.808 65.6589C324.575 64.1578 328.604 58.7842 328.604 52.3856C328.604 48.3564 327.025 44.7211 324.023 41.7972C320.23 38.1619 315.172 36.3452 308.615 36.3452H290.838V91.6529H298.74V69.6097H310.592C316.675 69.6097 319.125 72.1378 319.125 78.4599V91.6548H327.184V79.7239C327.184 71.0325 325.13 67.7147 318.808 66.7662V65.6589ZM252.282 67.4756H276.618V60.207H252.282V43.6139H278.988V36.3452H244.222V91.6529H280.173V84.3842H252.282V67.4756ZM225.812 70.3995V74.1916C225.812 82.1717 222.888 84.78 215.541 84.78H213.803C206.454 84.78 202.899 82.4088 202.899 71.4264V56.5717C202.899 45.5109 206.613 43.2181 213.96 43.2181H215.539C222.73 43.2181 225.021 45.9048 225.099 53.3322H233.791C233.001 42.4283 225.732 35.5555 214.828 35.5555C209.535 35.5555 205.11 37.2153 201.792 40.3745C196.814 45.0367 194.049 52.9383 194.049 63.9991C194.049 74.6659 196.42 82.5675 201.318 87.4649C204.636 90.7044 209.219 92.4426 213.723 92.4426C218.463 92.4426 222.81 90.5456 225.021 86.438H226.126V91.6529H233.395V63.1309H211.983V70.3995H225.812ZM156.126 43.6139H164.739C172.878 43.6139 177.303 45.6677 177.303 56.7304V71.2677C177.303 82.3285 172.878 84.3842 164.739 84.3842H156.126V43.6139ZM165.449 91.6548C180.541 91.6548 186.149 80.1982 186.149 64.001C186.149 47.5666 180.145 36.3471 165.29 36.3471H148.223V91.6548H165.449ZM110.063 67.4756H134.399V60.207H110.063V43.6139H136.768V36.3452H102.002V91.6529H137.954V84.3842H110.063V67.4756ZM63.4464 36.3452H55.3879V91.6529H91.7332V84.3842H63.4464V36.3452ZM0 91.6548V128H55.3076V119.94H8.05844V91.6548H0ZM0 0V36.3452H8.05844V8.05844H55.3076V0H0Z"
        fill="currentColor"
      />
    </svg>
  );
}

const OnboardingLogoContainer = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 1;
  display: flex;
  color: ${p => p.theme.colors.palette.text.shade100};
`;

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
    ONBOARDING_NOT_SEEDED: {
      target: "selectUseCase",
      actions: [
        assign((_, { deviceId }) => ({
          deviceId,
        })),
      ],
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
  const currentDevice = useSelector(getCurrentDevice);
  const notSeededDeviceRelaunch = useSelector(notSeededDeviceRelaunchSelector);

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
    if (notSeededDeviceRelaunch && currentDevice) {
      sendEvent("ONBOARDING_NOT_SEEDED", { deviceId: currentDevice.modelId });
      dispatch(setNotSeededDeviceRelaunch(false));
    }
  }, [currentDevice, dispatch, notSeededDeviceRelaunch, sendEvent]);

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

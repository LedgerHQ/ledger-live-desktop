import { DeviceModelId } from "@ledgerhq/devices";
import React, { useEffect, useState, createContext } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

// screens
import { Welcome } from "~/renderer/components/Onboarding/Screens/Welcome";
import { SelectDevice } from "~/renderer/components/Onboarding/Screens/SelectDevice";
import { SelectUseCase } from "~/renderer/components/Onboarding/Screens/SelectUseCase";
import Tutorial from "~/renderer/components/Onboarding/Screens/Tutorial";

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

type NullableDeviceModelId = DeviceModelId | null;

type OnboardingContextTypes = {
  deviceModelId: NullableDeviceModelId;
  setDeviceModelId: (deviceModelId: NullableDeviceModelId) => void;
};

export const OnboardingContext = createContext<OnboardingContextTypes>({
  deviceModelId: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDeviceModelId: () => {},
});

export function Onboarding() {
  const [imgsLoaded, setImgsLoaded] = useState(false);
  const [useCase, setUseCase] = useState(null);
  const [deviceModelId, setDeviceModelId] = useState<NullableDeviceModelId>(null);
  const [openedPedagogyModal, setOpenedPedagogyModal] = useState(false);
  const [openedTermsModal, setOpenedTermsModal] = useState(false);
  const [openedRecoveryPhraseWarningHelp, setOpenedRecoveryPhraseWarningHelp] = useState(false);
  const { path } = useRouteMatch();

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
        direction={"left"}
      >
        <Box px={40}>
          <RecoveryWarning />
        </Box>
      </SideDrawer>
      <OnboardingContainer className={imgsLoaded ? "onboarding-imgs-loaded" : ""}>
        <CSSTransition in appear key={path} timeout={DURATION} classNames="page-switch">
          <ScreenContainer>
            <Switch>
              <Route
                exact
                path={path}
                render={props => <Welcome {...props} setOpenedTermsModal={setOpenedTermsModal} />}
              />
              <Route
                path={`${path}/welcome`}
                render={props => <Welcome {...props} setOpenedTermsModal={setOpenedTermsModal} />}
              />
              <Route path={`${path}/select-device`} component={SelectDevice} />
              <Route
                path={`${path}/select-use-case`}
                render={props => (
                  <SelectUseCase
                    {...props}
                    setOpenedPedagogyModal={setOpenedPedagogyModal}
                    setUseCase={setUseCase}
                  />
                )}
              />
              <Route
                path={[
                  `${path}/${UseCase.setupDevice}`,
                  `${path}/${UseCase.connectDevice}`,
                  `${path}/${UseCase.recoveryPhrase}`,
                ]}
                render={props => useCase && <Tutorial {...props} useCase={useCase} />}
              />
            </Switch>
          </ScreenContainer>
        </CSSTransition>
      </OnboardingContainer>
    </OnboardingContext.Provider>
  );
}

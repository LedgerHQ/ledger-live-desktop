// @flow

import React, { useEffect, useRef } from "react";
import { Route, Switch, useLocation } from "react-router-dom";

import { getEnv } from "@ledgerhq/live-common/lib/env";
import Track from "~/renderer/analytics/Track";
import Dashboard from "~/renderer/screens/dashboard";
import Settings from "~/renderer/screens/settings";
import Accounts from "~/renderer/screens/accounts";
import Manager from "~/renderer/screens/manager";
import Partners from "~/renderer/screens/partners";
import Account from "~/renderer/screens/account";
import Asset from "~/renderer/screens/asset";
import SyncBackground from "~/renderer/components/SyncBackground";
import SyncContinuouslyPendingOperations from "~/renderer/components/SyncContinouslyPendingOperations";
import Box from "~/renderer/components/Box/Box";
import ListenDevices from "~/renderer/components/ListenDevices";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import Idler from "~/renderer/components/Idler";
import IsUnlocked from "~/renderer/components/IsUnlocked";
import OnboardingOrElse from "~/renderer/components/OnboardingOrElse";
import AppRegionDrag from "~/renderer/components/AppRegionDrag";
import CheckTermsAccepted from "~/renderer/components/CheckTermsAccepted";
import IsNewVersion from "~/renderer/components/IsNewVersion";
import LibcoreBusyIndicator from "~/renderer/components/LibcoreBusyIndicator";
import DeviceBusyIndicator from "~/renderer/components/DeviceBusyIndicator";
import KeyboardContent from "~/renderer/components/KeyboardContent";
import PerfIndicator from "~/renderer/components/PerfIndicator";
import MainSideBar from "~/renderer/components/MainSideBar";
import TriggerAppReady from "~/renderer/components/TriggerAppReady";
import ContextMenuWrapper from "~/renderer/components/ContextMenu/ContextMenuWrapper";
import DebugUpdater from "~/renderer/components/Updater/DebugUpdater";
import Page from "~/renderer/components/Page";
import ModalsLayer from "./ModalsLayer";

const reloadApp = event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "r") {
    window.api.reloadRenderer();
  }
};

const Default = () => {
  const location = useLocation();
  const ref: React$ElementRef<any> = useRef();

  useEffect(() => {
    window.addEventListener("keydown", reloadApp);
    return () => window.removeEventListener("keydown", reloadApp);
  }, []);

  // every time location changes, scroll back up
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <TriggerAppReady />
      <ListenDevices />
      <ExportLogsButton hookToShortcut />
      <Track mandatory onMount event="App Starts" />
      <Idler />
      {process.platform === "darwin" ? <AppRegionDrag /> : null}

      <IsUnlocked>
        <ContextMenuWrapper>
          <ModalsLayer />
          <OnboardingOrElse>
            <CheckTermsAccepted />

            <IsNewVersion />

            {process.env.DEBUG_UPDATE && <DebugUpdater />}

            <SyncContinuouslyPendingOperations
              priority={20}
              interval={getEnv("SYNC_PENDING_INTERVAL")}
            />
            <SyncBackground />
            <Box
              grow
              horizontal
              bg="palette.background.default"
              color="palette.text.shade60"
              style={{ width: "100%", height: "100%" }}
            >
              <MainSideBar />
              <Page>
                <Switch>
                  <Route path="/" exact render={props => <Dashboard {...props} />} />
                  <Route path="/settings" render={props => <Settings {...props} />} />
                  <Route path="/accounts" render={props => <Accounts {...props} />} />
                  <Route path="/manager" render={props => <Manager {...props} />} />
                  <Route path="/partners" render={props => <Partners {...props} />} />
                  <Route path="/account/:parentId/:id" render={props => <Account {...props} />} />
                  <Route path="/account/:id" render={props => <Account {...props} />} />
                  <Route path="/asset/:assetId+" render={props => <Asset {...props} />} />
                </Switch>
              </Page>
            </Box>

            <LibcoreBusyIndicator />
            <DeviceBusyIndicator />

            <KeyboardContent sequence="BJBJBJ">
              <PerfIndicator />
            </KeyboardContent>
          </OnboardingOrElse>
        </ContextMenuWrapper>
      </IsUnlocked>
    </>
  );
};

export default Default;

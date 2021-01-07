// @flow
import React, { useEffect, useRef } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import TrackAppStart from "~/renderer/components/TrackAppStart";
import { BridgeSyncProvider } from "~/renderer/bridge/BridgeSyncContext";
import { SyncNewAccounts } from "~/renderer/bridge/SyncNewAccounts";
import Dashboard from "~/renderer/screens/dashboard";
import Settings from "~/renderer/screens/settings";
import Accounts from "~/renderer/screens/accounts";
import Manager from "~/renderer/screens/manager";
import Exchange from "~/renderer/screens/exchange";
import Swap from "~/renderer/screens/exchange/swap";
import Account from "~/renderer/screens/account";
import Asset from "~/renderer/screens/asset";
import Lend from "~/renderer/screens/lend";
import Box from "~/renderer/components/Box/Box";
import ListenDevices from "~/renderer/components/ListenDevices";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import Idler from "~/renderer/components/Idler";
import IsUnlocked from "~/renderer/components/IsUnlocked";
import OnboardingOrElse from "~/renderer/components/OnboardingOrElse";
import AppRegionDrag from "~/renderer/components/AppRegionDrag";
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
import AnalyticsConsole from "~/renderer/components/AnalyticsConsole";
import DebugMock from "~/renderer/components/DebugMock";
import useDeeplink from "~/renderer/hooks/useDeeplinking";
import ModalsLayer from "./ModalsLayer";

export default function Default() {
  const location = useLocation();
  const ref: React$ElementRef<any> = useRef();
  useDeeplink();

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
      <TrackAppStart />
      <Idler />
      {process.platform === "darwin" ? <AppRegionDrag /> : null}

      <IsUnlocked>
        <BridgeSyncProvider>
          <ContextMenuWrapper>
            <ModalsLayer />
            <DebugMock />
            <OnboardingOrElse>
              <IsNewVersion />

              {process.env.DEBUG_UPDATE && <DebugUpdater />}

              <SyncNewAccounts priority={2} />

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
                    <Route path="/lend" render={props => <Lend {...props} />} />
                    <Route path="/exchange" render={props => <Exchange {...props} />} />
                    <Route path="/account/:parentId/:id" render={props => <Account {...props} />} />
                    <Route path="/account/:id" render={props => <Account {...props} />} />
                    <Route path="/asset/:assetId+" render={(props: any) => <Asset {...props} />} />
                    <Route path="/swap" render={props => <Swap {...props} />} />
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
        </BridgeSyncProvider>
      </IsUnlocked>

      {process.env.ANALYTICS_CONSOLE ? <AnalyticsConsole /> : null}
    </>
  );
}

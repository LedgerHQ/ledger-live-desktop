// @flow
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import TrackAppStart from "~/renderer/components/TrackAppStart";
import { BridgeSyncProvider } from "~/renderer/bridge/BridgeSyncContext";
import { SyncNewAccounts } from "~/renderer/bridge/SyncNewAccounts";
import Dashboard from "~/renderer/screens/dashboard";
import Settings from "~/renderer/screens/settings";
import Accounts from "~/renderer/screens/accounts";
import Card from "~/renderer/screens/card";
import Manager from "~/renderer/screens/manager";
import Exchange from "~/renderer/screens/exchange";
import Swap2 from "~/renderer/screens/exchange/Swap2";
import USBTroubleshooting from "~/renderer/screens/USBTroubleshooting";
import Account from "~/renderer/screens/account";
import WalletConnect from "~/renderer/screens/WalletConnect";
import Asset from "~/renderer/screens/asset";
import Lend from "~/renderer/screens/lend";
import PlatformCatalog from "~/renderer/screens/platform";
import PlatformApp from "~/renderer/screens/platform/App";
import NFTGallery from "~/renderer/screens/nft/Gallery";
import NFTCollection from "~/renderer/screens/nft/Gallery/Collection";
import Box from "~/renderer/components/Box/Box";
import ListenDevices from "~/renderer/components/ListenDevices";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import Idler from "~/renderer/components/Idler";
import IsUnlocked from "~/renderer/components/IsUnlocked";
import OnboardingOrElse from "~/renderer/components/OnboardingOrElse";
import AppRegionDrag from "~/renderer/components/AppRegionDrag";
import IsNewVersion from "~/renderer/components/IsNewVersion";
import IsSystemLanguageAvailable from "~/renderer/components/IsSystemLanguageAvailable";
import LibcoreBusyIndicator from "~/renderer/components/LibcoreBusyIndicator";
import DeviceBusyIndicator from "~/renderer/components/DeviceBusyIndicator";
import KeyboardContent from "~/renderer/components/KeyboardContent";
import PerfIndicator from "~/renderer/components/PerfIndicator";
import MainSideBar from "~/renderer/components/MainSideBar";
import TriggerAppReady from "~/renderer/components/TriggerAppReady";
import ContextMenuWrapper from "~/renderer/components/ContextMenu/ContextMenuWrapper";
import DebugUpdater from "~/renderer/components/debug/DebugUpdater";
import DebugTheme from "~/renderer/components/debug/DebugTheme";
import DebugFirmwareUpdater from "~/renderer/components/debug/DebugFirmwareUpdater";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Page from "~/renderer/components/Page";
import AnalyticsConsole from "~/renderer/components/AnalyticsConsole";
import DebugMock from "~/renderer/components/debug/DebugMock";
import DebugSkeletons from "~/renderer/components/debug/DebugSkeletons";
import { DebugWrapper } from "~/renderer/components/debug/shared";
import useDeeplink from "~/renderer/hooks/useDeeplinking";
import useUSBTroubleshooting from "~/renderer/hooks/useUSBTroubleshooting";
import ModalsLayer from "./ModalsLayer";
import { ToastOverlay } from "~/renderer/components/ToastOverlay";
import Drawer from "~/renderer/drawers/Drawer";
import UpdateBanner from "~/renderer/components/Updater/Banner";
import FirmwareUpdateBanner from "~/renderer/components/FirmwareUpdateBanner";
// $FlowFixMe
import Market from "~/renderer/screens/market";
// $FlowFixMe
import MarketCoinScreen from "~/renderer/screens/market/MarketCoinScreen";

export const TopBannerContainer: ThemedComponent<{}> = styled.div`
  position: sticky;
  top: 0;
  z-index: 19;
  & > *:not(:first-child) {
    display: none;
  }
`;

const NightlyLayerR = () => {
  const children = [];
  const w = 200;
  const h = 100;
  for (let y = 0.5; y < 20; y++) {
    for (let x = 0.5; x < 20; x++) {
      children.push(
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            top: y * h,
            left: x * w,
            transform: "rotate(-45deg)",
          }}
        >
          NIGHTLY
          <br />
          {__APP_VERSION__}
        </div>,
      );
    }
  }
  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        opacity: 0.1,
        color: "#777",
        width: "100%",
        height: "100%",
        top: 0,
        right: 0,
        zIndex: 999999999999,
      }}
    >
      {children}
    </div>
  );
};

const NightlyLayer = React.memo(NightlyLayerR);

export default function Default() {
  const location = useLocation();
  const ref: React$ElementRef<any> = useRef();
  useDeeplink();
  useUSBTroubleshooting();

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
            <DebugWrapper>
              {process.env.DEBUG_THEME ? <DebugTheme /> : null}
              {process.env.MOCK ? <DebugMock /> : null}
              {process.env.DEBUG_UPDATE ? <DebugUpdater /> : null}
              {process.env.DEBUG_SKELETONS ? <DebugSkeletons /> : null}
              {process.env.DEBUG_FIRMWARE_UPDATE ? <DebugFirmwareUpdater /> : null}
            </DebugWrapper>
            <OnboardingOrElse>
              <Switch>
                <Route exact path="/walletconnect">
                  <WalletConnect />
                </Route>
                <Route>
                  <IsNewVersion />
                  <IsSystemLanguageAvailable />
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
                      <TopBannerContainer>
                        <UpdateBanner />
                        <FirmwareUpdateBanner />
                      </TopBannerContainer>
                      <Switch>
                        <Route path="/" exact render={props => <Dashboard {...props} />} />
                        <Route path="/settings" render={props => <Settings {...props} />} />
                        <Route path="/accounts" render={props => <Accounts {...props} />} />
                        <Route path="/card" render={props => <Card {...props} />} />
                        <Redirect from="/manager/reload" to="/manager" />
                        <Route path="/manager" render={props => <Manager {...props} />} />
                        <Route
                          path="/platform"
                          render={(props: any) => <PlatformCatalog {...props} />}
                          exact
                        />
                        <Route
                          path="/platform/:appId"
                          render={(props: any) => <PlatformApp {...props} />}
                        />
                        <Route path="/lend" render={props => <Lend {...props} />} />
                        <Route path="/exchange" render={props => <Exchange {...props} />} />
                        <Route
                          exact
                          path="/account/:id/nft-collection"
                          render={props => <NFTGallery {...props} />}
                        />
                        <Route
                          path="/account/:id/nft-collection/:collectionAddress?"
                          render={props => <NFTCollection {...props} />}
                        />
                        <Route
                          path="/account/:parentId/:id"
                          render={props => <Account {...props} />}
                        />
                        <Route path="/account/:id" render={props => <Account {...props} />} />
                        <Route
                          path="/asset/:assetId+"
                          render={(props: any) => <Asset {...props} />}
                        />
                        <Route path="/swap" render={props => <Swap2 {...props} />} />
                        <Route
                          path="/USBTroubleshooting"
                          render={props => <USBTroubleshooting {...props} />}
                        />

                        <Route
                          path="/market/:currencyId"
                          render={props => <MarketCoinScreen {...props} />}
                        />
                        <Route path="/market" render={props => <Market {...props} />} />
                      </Switch>
                    </Page>
                    <Drawer />
                    <ToastOverlay />
                  </Box>

                  {__NIGHTLY__ ? <NightlyLayer /> : null}

                  <LibcoreBusyIndicator />
                  <DeviceBusyIndicator />
                  <KeyboardContent sequence="BJBJBJ">
                    <PerfIndicator />
                  </KeyboardContent>
                </Route>
              </Switch>
            </OnboardingOrElse>
          </ContextMenuWrapper>
        </BridgeSyncProvider>
      </IsUnlocked>

      {process.env.ANALYTICS_CONSOLE ? <AnalyticsConsole /> : null}
    </>
  );
}

// @flow
import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import styled from "styled-components";
import { Redirect, Route, Switch, useLocation, useHistory } from "react-router-dom";
import { flattenAccounts, getAccountCurrency } from "@ledgerhq/live-common/lib/account";
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
import "ninja-keys";
import { useDispatch, useSelector } from "react-redux";
import { setCounterValue, setShareAnalytics, setTheme } from "~/renderer/actions/settings";
import { themeSelector } from "./actions/general";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import { supportedCountervalues } from "~/renderer/reducers/settings";
import { accountsSelector } from "~/renderer/reducers/accounts";
import StyleProvider from "~/renderer/styles/StyleProvider";
import CryptoCurrencyIcon from "./components/CryptoCurrencyIcon";
import { Icons } from "@ledgerhq/react-ui";
import { openModal } from "~/renderer/actions/modals";

import nyanMP3 from "../../static/nyancat.mp3";
import nyanGif from "../../static/nyan.gif";

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

const ICONS = {
  NyanMedium: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="76px" height="76px" viewBox="0 0 76 76" version="1.1" baseProfile="full" enable-background="new 0 0 76.00 76.00" xml:space="preserve">
	  <path fill="#000000" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 28.4874,31.6667L 30.0707,31.6667L 30.0707,33.25L 28.4874,33.25L 28.4874,31.6667 Z M 28.5,39.5834L 30.0833,39.5834L 30.0833,41.1667L 28.5,41.1667L 28.5,39.5834 Z M 33.25,33.2501L 34.8333,33.2501L 34.8333,34.8334L 33.25,34.8334L 33.25,33.2501 Z M 31.6996,41.1667L 33.283,41.1667L 33.283,42.75L 31.6996,42.75L 31.6996,41.1667 Z M 30.0833,36.4167L 31.6666,36.4167L 31.6666,38.0001L 30.0833,38.0001L 30.0833,36.4167 Z M 34.8333,30.0834L 36.4166,30.0834L 36.4166,31.6667L 34.8333,31.6667L 34.8333,30.0834 Z M 44.3333,40.3751C 45.2077,40.3751 45.9166,41.1253 45.9166,41.5626C 45.9166,41.9998 45.2077,42.3542 44.3333,42.3542C 43.4588,42.3542 42.7499,41.9998 42.7499,41.5626C 42.7499,41.1253 43.4588,40.3751 44.3333,40.3751 Z M 53.8333,40.3751C 54.7077,40.3751 55.4166,41.1253 55.4166,41.5625C 55.4166,41.9998 54.7077,42.3542 53.8333,42.3542C 52.9588,42.3542 52.25,41.9998 52.25,41.5625C 52.25,41.1253 52.9588,40.3751 53.8333,40.3751 Z M 41.1666,30.4792L 46.3124,36.0209L 47.4999,36.0209L 47.4999,31.6667C 47.4999,29.9178 46.0822,28.5001 44.3333,28.5001L 30.0833,28.5C 28.3344,28.5 26.9167,29.9178 26.9167,31.6667L 26.9166,40.3751C 26.9166,42.124 28.3344,44.3334 30.0833,44.3334L 36.5299,44.3334C 35.2027,40.2631 38.1847,35.4492 41.1666,30.4792 Z M 50.2708,36.0209L 50.6666,35.5946L 50.6666,28.5C 50.6666,26.7511 49.2489,25.3334 47.5,25.3334L 26.9166,25.3334C 25.1677,25.3334 23.75,26.7511 23.75,28.5L 23.75,38L 23.75,42.75L 23.75,44.3334C 23.75,46.0822 25.1677,47.5 26.9166,47.5L 28.5,47.5L 30.0833,47.5L 38.6804,47.5C 38.1146,46.9897 37.6579,46.4614 37.2983,45.9167L 29.2916,45.9167C 27.5427,45.9167 25.3333,42.9156 25.3333,41.1667L 25.3333,30.875C 25.3333,29.1261 27.5428,26.9167 29.2917,26.9167L 45.1249,26.9167C 46.8738,26.9167 49.0833,29.1262 49.0833,30.8751L 49.0833,36.0209L 50.2708,36.0209 Z M 55.4166,30.4792C 55.4166,30.4792 69.0457,45.2441 51.8743,50.3375C 52.3509,51.3635 52.5666,52.6458 50.6667,52.6458C 49.8163,52.6458 49.5542,51.6181 49.4938,50.6667L 45.5641,50.6667C 45.9793,51.6181 46.0341,52.6458 44.3333,52.6458C 43.3174,52.6458 43.0552,51.1793 42.9977,50.1281L 40.9023,49.0834L 30.9554,49.0834C 31.5857,50.4649 32.0246,52.25 30.0833,52.25C 29.1127,52.25 28.7371,50.4649 28.5917,49.0834L 26.9181,49.0834C 26.6335,50.3285 25.5198,51.8542 21.7708,51.8542C 20.657,51.8542 22.8732,49.6994 24.2855,48.4215C 23.1286,47.6336 22.1666,46.279 22.1666,45.125L 22.1666,42.4751C 12.8265,40.5393 14.3299,34.7534 15.8333,33.25C 16.9098,32.1735 20.182,34.7566 22.1666,36.5205L 22.1666,27.7084C 22.1666,25.9595 24.3761,23.75 26.125,23.75L 48.2916,23.75C 50.0405,23.75 52.25,25.9595 52.25,27.7084L 52.25,33.8895L 55.4166,30.4792 Z M 41.1666,33.25C 36.4166,39.5834 38,49.0834 45.9166,49.0834L 50.6666,49.0834C 64.9166,45.9167 55.4166,33.25 55.4166,33.25L 50.6666,38L 45.9166,38L 41.1666,33.25 Z M 49.4791,41.1667C 49.9164,41.1667 50.2708,41.5211 50.2708,41.9584C 50.2708,42.3956 49.9164,42.75 49.4791,42.75C 49.0419,42.75 48.6875,42.3956 48.6875,41.9584C 48.6875,41.5211 49.0419,41.1667 49.4791,41.1667 Z M 42.75,44.3333L 44.3333,44.3333C 44.3333,45.9167 46.7083,47.5 46.7083,44.3333C 48.2916,44.3333 48.2916,43.5912 48.2916,43.5912C 48.2916,43.5912 48.2916,44.3333 49.875,44.3333C 49.875,47.5 52.25,46.0156 52.25,44.3828L 53.8333,44.3333C 53.8333,44.3333 53.8333,47.5 50.6666,47.5C 49.0833,47.5 48.2916,45.9167 48.2916,45.9167C 48.2916,45.9167 47.5,47.5 45.9166,47.5C 42.75,47.5 42.75,44.3333 42.75,44.3333 Z M 44.3333,30.0834L 45.9166,30.0834L 45.9166,31.6667L 44.3333,31.6667L 44.3333,30.0834 Z M 17.0208,35.625C 15.5736,37.0723 18.095,39.5118 22.1666,41.1296L 22.1666,38.6096C 20.6522,36.9624 18.1004,34.5455 17.0208,35.625 Z "/>
  </svg>`,
};
function iconMarkup(prefix, selectedPalette) {
  const name = prefix + "Medium";
  if (ICONS[name]) return ICONS[name];
  const Icon = Icons[name];
  return renderToStaticMarkup(
    <StyleProvider selectedPalette={selectedPalette}>
      <div style={{ marginRight: "10px", display: "flex" }}>
        <Icon />
      </div>
    </StyleProvider>,
  );
}

const startNyan = (() => {
  const MP3_SRC = nyanMP3;
  const IMG_SRC = nyanGif;

  const STEP_SIZE = 10;
  let audio,
    body,
    img,
    targetX,
    targetY,
    mouseX = 0,
    mouseY = 0;

  function createAudioElement() {
    audio = document.createElement("embed");
    audio.src = MP3_SRC;
    audio.setAttribute("hidden", "true");
    audio.setAttribute("autostart", "true");
    audio.setAttribute("loop", "true");
  }

  function createImgElement() {
    img = document.createElement("img");
    img.src = IMG_SRC;
    img.style["width"] = "400px";
    img.style["z-index"] = "100";
    img.style["position"] = "fixed";
    img.style["left"] = 0;
    img.style["top"] = 0;
  }

  function randomWalk() {
    setRandomTarget();
    setInterval(function() {
      if (atTarget()) {
        setRandomTarget();
      }
      stepTowardsTarget();
    }, 20);
  }

  function speed() {
    var bonus = 0;
    var dx = mouseX - posX();
    var dy = mouseY - posY();
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 500) {
      bonus = (500 - dist) / 10;
    }
    return STEP_SIZE + bonus;
  }

  function atTarget() {
    return posX() == targetX && posY() == targetY;
  }

  function setRandomTarget() {
    targetX = Math.floor(Math.random() * window.innerWidth);
    targetY = Math.floor(Math.random() * window.innerHeight);
  }

  function posX() {
    return parseFloat(img.style["left"]);
  }

  function posY() {
    return parseFloat(img.style["top"]);
  }

  function stepTowardsTarget() {
    const dx = targetX - posX();
    const dy = targetY - posY();
    const d = Math.sqrt(dx * dx + dy * dy);
    const step = speed();
    if (d <= step) {
      img.style["left"] = targetX + "px";
      img.style["top"] = targetY + "px";
    } else {
      img.style["left"] = posX() + (dx * step) / d + "px";
      img.style["top"] = posY() + (dy * step) / d + "px";
    }
  }

  function setMouseListener() {
    window.addEventListener("mousemove", function() {
      mouseX = window.event.clientX;
      mouseY = window.event.clientY;
    });
  }

  return function() {
    createAudioElement();
    createImgElement();
    body = document.getElementsByTagName("body")[0];
    body.appendChild(audio);
    body.appendChild(img);
    setMouseListener();
    randomWalk();
  };
})();

function getCountervaluesHotkeys(supportedCountervalues, dispatch) {
  return supportedCountervalues.map(countervalue => ({
    id: countervalue.currency.ticker,
    title: `Change preferred currency to ${countervalue.label}`,
    parent: "countervalues",
    handler: item => {
      dispatch(setCounterValue(item.id));
    },
  }));
}

export default function Default() {
  const location = useLocation();
  const history = useHistory();
  const ref: React$ElementRef<any> = useRef();
  useDeeplink();
  useUSBTroubleshooting();
  const selectedPalette = useSelector(themeSelector) || "light";
  const accounts = useSelector(accountsSelector);
  const dispatch = useDispatch();
  const [hkAccounts, setHkAccounts] = useState([]);

  useEffect(() => {
    if (accounts.length) {
      const flatten = flattenAccounts(accounts)
        .map((a, _, arr) => {
          const currency = getAccountCurrency(a);
          if (a.type === "Account") {
            const childrenAccounts = arr.filter(f => f.parentId === a.id).map(f => f.id);
            const hasChildAccounts = childrenAccounts.length > 0;
            return {
              id: a.id,
              title: a.name,
              currency,
              parent: "accountsList",
              children: childrenAccounts,
              section: "Accounts",
              handler: () => {
                history.push(`/account/${a.id}`);
                return { keepOpen: hasChildAccounts };
              },
            };
          }

          if (a.type === "TokenAccount" || a.type === "ChildAccount") {
            return {
              id: a.id,
              title: a?.token?.name ?? a.name,
              currency,
              parent: a.parentId,
              section: "Accounts",
              handler: () => {
                history.push(`/account/${a.parentId}/${a.id}`);
              },
            };
          }
          return undefined;
        })
        .filter(Boolean)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(item => ({
          ...item,
          icon: renderToStaticMarkup(
            <StyleProvider selectedPalette={selectedPalette}>
              <div style={{ width: "1.5em", height: "1.5em", marginRight: "0.5em" }}>
                <CryptoCurrencyIcon currency={item.currency} />
              </div>
            </StyleProvider>,
          ),
        }));

      Promise.all(flatten).then(setHkAccounts);
    } else {
      setHkAccounts([]);
    }
  }, [accounts, history, selectedPalette]);

  const hkBase = useMemo(
    () => [
      {
        id: "accountsList",
        title: "List accounts",
        section: "Commands",
        hotkey: "cmd+a, ctrl+a",
        icon: iconMarkup("List", selectedPalette),
        children: accounts.map(a => a.id),
        handler: () => {
          return { keepOpen: true };
        },
      },
      {
        id: "Home",
        title: "Open Home",
        hotkey: "cmd+h, ctrl+h",
        section: "Navigation",
        icon: iconMarkup("House", selectedPalette),
        handler: () => {
          history.push("/");
        },
      },
      {
        id: "Theme",
        title: "Change theme...",
        section: "Commands",
        children: ["Light Theme", "Dark Theme"],
        icon: iconMarkup("Instagram", selectedPalette),
        handler: () => {
          return { keepOpen: true };
        },
      },
      {
        id: "Open Ledger Support",
        title: "Open Ledger Support",
        section: "Commands",
        icon: iconMarkup("Phone", selectedPalette),
        handler: () => {
          openURL(urls.faq);
        },
      },
      {
        id: "Analytics",
        title: "Analytics...",
        section: "Commands",
        children: ["Enable Analytics", "Disable Analytics"],
        icon: iconMarkup("Logs", selectedPalette),
        handler: () => {
          return { keepOpen: true };
        },
      },
      {
        id: "Enable Analytics",
        title: "Enable Analytics",
        parent: "Analytics",
        section: "Commands",
        handler: () => {
          dispatch(setShareAnalytics(true));
        },
      },
      {
        id: "Disable Analytics",
        title: "Disable Analytics",
        parent: "Analytics",
        section: "Commands",
        handler: () => {
          dispatch(setShareAnalytics(false));
        },
      },
      {
        id: "Light Theme",
        title: "Change theme to Light",
        keyword: "light",
        parent: "Theme",
        section: "Commands",
        handler: () => {
          dispatch(setTheme("light"));
        },
      },
      {
        id: "Dark Theme",
        title: "Change theme to Dark",
        keyword: "dark",
        parent: "Theme",
        section: "Commands",
        handler: () => {
          dispatch(setTheme("dark"));
        },
      },
      {
        id: "settings",
        title: "Settings Page",
        hotkey: "cmd+s, ctrl+s",
        section: "Navigation",
        icon: iconMarkup("Settings", selectedPalette),
        handler: () => {
          history.push("/settings");
        },
      },
      {
        id: "accounts",
        title: "Accounts Page",
        section: "Navigation",
        icon: iconMarkup("Wallet", selectedPalette),
        handler: () => {
          history.push("/accounts");
        },
      },
      {
        id: "card",
        title: "Ledger Card Page",
        section: "Navigation",
        icon: iconMarkup("Card", selectedPalette),
        handler: () => {
          history.push("/card");
        },
      },
      {
        id: "manager",
        title: "Manager Page",
        section: "Navigation",
        icon: iconMarkup("Manager", selectedPalette),
        handler: () => {
          history.push("/manager");
        },
      },
      {
        id: "platform",
        title: "Platform Page",
        section: "Navigation",
        icon: iconMarkup("ChartNetwork", selectedPalette),
        handler: () => {
          history.push("/platform");
        },
      },
      {
        id: "lend",
        title: "Lend Page",
        section: "Navigation",
        icon: iconMarkup("Lend", selectedPalette),
        handler: () => {
          history.push("/lend");
        },
      },
      {
        id: "exchange",
        title: "Buy Page",
        section: "Navigation",
        icon: iconMarkup("Coin", selectedPalette),
        handler: () => {
          history.push("/exchange");
        },
      },
      {
        id: "swap",
        title: "Swap Page",
        section: "Navigation",
        icon: iconMarkup("Redelegate", selectedPalette),
        handler: () => {
          history.push("/swap");
        },
      },
      {
        id: "market",
        title: "Market Page",
        section: "Navigation",
        icon: iconMarkup("Portfolio", selectedPalette),
        handler: () => {
          history.push("/market");
        },
      },
      {
        id: "countervalues",
        title: "Change preferred currency...",
        section: "Commands",
        icon: iconMarkup("SearchDollar", selectedPalette),
        children: supportedCountervalues.map(countervalue => countervalue.currency.ticker),
      },
      ...getCountervaluesHotkeys(supportedCountervalues, dispatch),
      {
        id: "send",
        title: "Send crypto",
        section: "Transaction",
        icon: iconMarkup("ArrowTop", selectedPalette),
        handler: () => {
          dispatch(openModal("MODAL_SEND"));
        },
      },
      {
        id: "Receive",
        title: "Receive crypto",
        section: "Transaction",
        icon: iconMarkup("ArrowBottom", selectedPalette),
        handler: () => {
          dispatch(openModal("MODAL_RECEIVE"));
        },
      },
      {
        id: "nyan",
        title: "Mew!",
        parent: "None",
        keywords: "nyan",
        icon: iconMarkup("Nyan", selectedPalette),
        handler: () => {
          startNyan();
        },
      },
    ],
    [history, dispatch, accounts, selectedPalette],
  );

  const hotkeys = useMemo(() => [...hkBase, ...hkAccounts], [hkBase, hkAccounts]);

  // every time location changes, scroll back up
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTo(0, 0);
    }
  }, [location]);

  const ninjaKeys = useRef(null);

  useEffect(() => {
    if (ninjaKeys.current) {
      ninjaKeys.current.data = hotkeys;
    }
  }, [hotkeys]);

  return (
    <>
      <ninja-keys
        class={selectedPalette}
        ref={ninjaKeys}
        goBackHotkey={null}
        noAutoLoadMdIcons
      ></ninja-keys>

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

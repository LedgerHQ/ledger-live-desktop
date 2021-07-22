// @flow
import React, { useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import type { Store } from "redux";
import { HashRouter as Router } from "react-router-dom";

import "./global.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/animations/shift-toward.css";
import "tippy.js/dist/svg-arrow.css";

import type { State } from "~/renderer/reducers";
import StyleProvider from "~/renderer/styles/StyleProvider";
import { UpdaterProvider } from "~/renderer/components/Updater/UpdaterContext";
import ThrowBlock from "~/renderer/components/ThrowBlock";
import LiveStyleSheetManager from "~/renderer/styles/LiveStyleSheetManager";
import { RemoteConfigProvider } from "~/renderer/components/RemoteConfig";
import CountervaluesProvider from "~/renderer/components/CountervaluesProvider";
import DrawerProvider from "~/renderer/drawers/Provider";
import Default from "./Default";
import WalletConnectProvider from "./screens/WalletConnect/Provider";
import { AnnouncementProviderWrapper } from "~/renderer/components/AnnouncementProviderWrapper";
import { ToastProvider } from "@ledgerhq/live-common/lib/notifications/ToastProvider";
import { PlatformAppProvider } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";

const reloadApp = event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "r") {
    window.api.reloadRenderer();
  }
};

type Props = {
  store: Store<State, *>,
  initialCountervalues: *,
};

const extraManifests = [
  {
    id: "lido",
    name: "Lido",
    url:
      "https://ledger-live-platform-apps.vercel.app/app/dapp-browser?dappName=Lido&nanoApp=Lido&url=https%3A%2F%2Fledger-hq-test.vercel.app%2F%3Fembed%3Dtrue%26ref%3D0x558247e365be655f9144e1a0140D793984372Ef3",
    homepageUrl: "https://lido.fi/",
    icon: "https://cdn.live.ledger.com/icons/platform/lido.png",
    platform: "all",
    apiVersion: "0.0.1",
    manifestVersion: "1",
    branch: "stable",
    categories: ["staking", "defi"],
    currencies: ["ethereum"],
    content: {
      shortDescription: {
        en: "Stake your ETH with Lido to earn daily staking rewards.",
      },
      description: {
        en: "Stake your ETH with Lido to earn daily staking rewards.",
      },
    },
    permissions: [],
    domains: ["https://*"],
  },
  {
    id: "1inch",
    name: "1Inch",
    url:
      "https://ledger-live-platform-apps.vercel.app/app/dapp-browser?dappName=1Inch&nanoApp=1Inch&url=https%3A%2F%2Fapp.1inch.io%2F%3FledgerLive%3Dtrue",
    homepageUrl: "https://1inch.io/",
    icon: "https://cdn.live.ledger.com/icons/platform/1inch.png",
    platform: "all",
    apiVersion: "0.0.1",
    manifestVersion: "1",
    branch: "stable",
    categories: ["swap", "defi"],
    currencies: ["ethereum"],
    content: {
      shortDescription: {
        en: "Exchange crypto via a Defi/DEX aggregator on Ethereum.",
      },
      description: {
        en: "Exchange crypto via a Defi/DEX aggregator on Ethereum.",
      },
    },
    permissions: [],
    domains: ["https://*"],
  },
];

const App = ({ store, initialCountervalues }: Props) => {
  const [reloadEnabled, setReloadEnabled] = useState(true);

  useEffect(() => {
    const reload = e => {
      if (reloadEnabled) {
        reloadApp(e);
      }
    };

    window.addEventListener("keydown", reload);
    return () => window.removeEventListener("keydown", reload);
  }, [reloadEnabled]);

  return (
    <LiveStyleSheetManager>
      <Provider store={store}>
        <StyleProvider selectedPalette="light">
          <ThrowBlock
            onError={() => {
              if (!__DEV__) {
                setReloadEnabled(false);
              }
            }}
          >
            <RemoteConfigProvider>
              <UpdaterProvider>
                <CountervaluesProvider initialState={initialCountervalues}>
                  <ToastProvider>
                    <AnnouncementProviderWrapper>
                      <Router>
                        <WalletConnectProvider>
                          <PlatformAppProvider extraManifests={extraManifests}>
                            <DrawerProvider>
                              <Default />
                            </DrawerProvider>
                          </PlatformAppProvider>
                        </WalletConnectProvider>
                      </Router>
                    </AnnouncementProviderWrapper>
                  </ToastProvider>
                </CountervaluesProvider>
              </UpdaterProvider>
            </RemoteConfigProvider>
          </ThrowBlock>
        </StyleProvider>
      </Provider>
    </LiveStyleSheetManager>
  );
};

export default hot(App);

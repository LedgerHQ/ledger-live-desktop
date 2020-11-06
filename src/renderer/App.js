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
import Default from "./Default";

const reloadApp = event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "r") {
    window.api.reloadRenderer();
  }
};

type Props = {
  store: Store<State, *>,
};

const App = ({ store }: Props) => {
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
                <CountervaluesProvider>
                  <Router>
                    <Default />
                  </Router>
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

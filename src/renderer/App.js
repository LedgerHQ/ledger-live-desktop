// @flow
import React from "react";
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import type { Store } from "redux";
import { HashRouter as Router } from "react-router-dom";

import "./global.css";
import type { State } from "~/renderer/reducers";
import StyleProvider from "~/renderer/styles/StyleProvider";
import { UpdaterProvider } from "~/renderer/components/Updater/UpdaterContext";
import ThrowBlock from "~/renderer/components/ThrowBlock";
import LiveStyleSheetManager from "~/renderer/styles/LiveStyleSheetManager";
import Default from "./Default";

type Props = {
  store: Store<State, *>,
};

const App = ({ store }: Props) => (
  <LiveStyleSheetManager>
    <Provider store={store}>
      <StyleProvider selectedPalette="light">
        <ThrowBlock>
          <UpdaterProvider>
            <Router>
              <Default />
            </Router>
          </UpdaterProvider>
        </ThrowBlock>
      </StyleProvider>
    </Provider>
  </LiveStyleSheetManager>
);

export default hot(App);

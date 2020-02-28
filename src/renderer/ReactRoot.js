// @flow
import React, { Component } from "react";
import type { Store } from "redux";
import type { State as StoreState } from "~/renderer/reducers";
import App from "./App";
import "./global.css";

type State = {
  error: mixed,
};

type Props = {
  store: Store<StoreState, *>,
  language: string,
};

class ReactRoot extends Component<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error: mixed) {
    this.setState({ error });
  }

  render() {
    const { store, language } = this.props;
    const { error } = this.state;
    return error ? String(error) : <App store={store} language={language} />;
  }
}

export default ReactRoot;

/* @flow */
import React, { useReducer, useEffect } from "react";

type State = {
  Component: *,
  props: *,
  open: boolean,
};

// actions
// it makes them available and current from connector events handlers
export let setDrawer: (Component?: *, props?: *) => void = () => {};

// reducer
const reducer = (state: State, update) => {
  return {
    ...state,
    ...update,
  };
};
const initialState = {
  Component: null,
  props: null,
  open: false,
};

export const context = React.createContext<State>(initialState);

const DrawerProvider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setDrawer = (Component, props) => dispatch({ Component, props, open: !!Component });
  }, []);

  return <context.Provider value={state}>{children}</context.Provider>;
};

export default DrawerProvider;

/* @flow */
import React, { useReducer, useEffect, useCallback } from "react";

type State = {
  Component: ?React$ComponentType<*>,
  props?: *,
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
const initialState: State = {
  Component: null,
  props: null,
  open: false,
};

type ContextValue = {
  state: State,
  setDrawer: (Component?: React$ComponentType<*>, props?: *) => void,
};

export const context = React.createContext<ContextValue>({
  state: initialState,
  setDrawer: () => {},
});

const DrawerProvider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const _setDrawer = useCallback(
    (Component, props) => dispatch({ Component, props, open: !!Component }),
    [],
  );

  useEffect(() => {
    setDrawer = _setDrawer;
  }, [_setDrawer]);

  return <context.Provider value={{ state, setDrawer: _setDrawer }}>{children}</context.Provider>;
};

export default DrawerProvider;

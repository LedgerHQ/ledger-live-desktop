/* @flow */
import React, { useReducer, useEffect, useCallback } from "react";

import type { DrawerProps as SideDrawerProps } from "~/renderer/components/SideDrawer";
type State = {
  Component: ?React$ComponentType<*>,
  props?: null | *,
  open: boolean,
  options: $Diff<SideDrawerProps, { children: *, isOpen: *, onRequestBack: *, onRequestClose: * }>,
};

// actions
// it makes them available and current from connector events handlers
export let setDrawer: (
  Component?: $PropertyType<State, "Component">,
  props?: $PropertyType<State, "props">,
  options?: $PropertyType<State, "options">,
) => void = () => {};

// reducer
const reducer = (state: State, update) => {
  return {
    ...state,
    ...update,
  };
};
const initialState: State = { Component: null, props: null, open: false, options: {} };

type ContextValue = { state: State, setDrawer: typeof setDrawer };

export const context = React.createContext<ContextValue>({
  state: initialState,
  setDrawer: () => {},
});

const DrawerProvider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const _setDrawer: typeof setDrawer = useCallback(
    (Component, props, options = {}) => dispatch({ Component, props, open: !!Component, options }),
    [],
  );

  useEffect(() => {
    setDrawer = _setDrawer;
  }, [_setDrawer]);

  return <context.Provider value={{ state, setDrawer: _setDrawer }}>{children}</context.Provider>;
};

export default DrawerProvider;

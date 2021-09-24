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
  closeDrawer: () => void,
};

export const context = React.createContext<ContextValue>({
  state: initialState,
  setDrawer: () => {},
  closeDrawer: () => {},
});

const DrawerProvider = ({ children }: { children: React$Node }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const _setDrawer = useCallback(
    (Component, props) => dispatch({ Component, props, open: !!Component }),
    [],
  );
  const _closeDrawer = useCallback(
    () => dispatch({ Component: undefined, props: {}, open: false }),
    [],
  );

  useEffect(() => {
    setDrawer = _setDrawer;
  }, [_setDrawer]);

  return (
    <context.Provider value={{ state, setDrawer: _setDrawer, closeDrawer: _closeDrawer }}>
      {children}
    </context.Provider>
  );
};

export default DrawerProvider;

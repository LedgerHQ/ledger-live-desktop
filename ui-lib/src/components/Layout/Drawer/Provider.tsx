import React, { useReducer, useEffect, useCallback, useContext } from "react";
interface State {
  Component: React.ComponentType<any> | null | undefined;
  props?: any;
  open: boolean;
}
// actions
// it makes them available and current from connector events handlers
export let setDrawer: (Component?: any, props?: any) => void = () => {};

// reducer
const reducer = (state: State, update: State) => {
  return { ...state, ...update };
};

const initialState: State = {
  Component: null,
  props: null,
  open: false,
};
interface ContextValue {
  state: State;
  setDrawer: (Component?: React.ComponentType<any>, props?: any) => void;
}
export const context = React.createContext<ContextValue>({
  state: initialState,
  setDrawer: () => {},
});
export const useDrawer = () => {
  const drawerContext = useContext(context);
  return drawerContext;
};

const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const _setDrawer = useCallback((Component, props) => {
    dispatch({
      Component,
      props,
      open: !!Component,
    });
  }, []);

  useEffect(() => {
    setDrawer = _setDrawer;
  }, [_setDrawer]);
  return (
    <context.Provider
      value={{
        state,
        setDrawer: _setDrawer,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default DrawerProvider;

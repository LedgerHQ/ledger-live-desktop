import React, { useReducer, useEffect, useCallback, useContext } from "react";

interface State {
  Component: React.ComponentType<any> | null | undefined;
  props?: any;
  open: boolean;
}
// actions
// it makes them available and current from connector events handlers
export let setSide: (Component?: any, props?: any) => void = () => {};

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
  setSide: (Component?: React.ComponentType<any>, props?: any) => void;
}

export const context = React.createContext<ContextValue>({
  state: initialState,
  setSide: () => {},
});

export const useSide = () => {
  const sideContext = useContext(context);
  return sideContext;
};

const SideProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const _setSide = useCallback((Component, props) => {
    dispatch({
      Component,
      props,
      open: !!Component,
    });
  }, []);

  useEffect(() => {
    setSide = _setSide;
  }, [_setSide]);

  return (
    <context.Provider
      value={{
        state,
        setSide: _setSide,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default SideProvider;

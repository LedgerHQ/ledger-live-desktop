import React, { useReducer, useEffect, useCallback } from "react";
import { DrawerProps } from "@ledgerhq/react-ui/components/layout/Drawer";

type State = {
  Component?: React.ComponentType;
  componentProps?: null | Record<string, any>;
  open: boolean;
  options?: Partial<Omit<DrawerProps, "children" | "isOpen">> & {
    useLightTheme?: boolean;
  };
  // isOpen and children are controlled by the Drawer component itself according to the context
};

// actions
// it makes them available and current from connector events handlers
export let setDrawer: (
  Component?: State["Component"],
  componentProps?: State["componentProps"],
  options?: State["options"],
) => void = () => {};

// reducer
const reducer = (state: State, update: State) => {
  return {
    ...state,
    ...update,
  };
};
const initialState: State = {
  Component: undefined,
  componentProps: null,
  open: false,
  options: {},
};

type ContextValue = { state: State; setDrawer: typeof setDrawer };

export const context = React.createContext<ContextValue>({
  state: initialState,
  setDrawer: () => {},
});

const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const _setDrawer: typeof setDrawer = useCallback((Component, componentProps, options) => {
    dispatch({ Component, componentProps, open: !!Component, options });
  }, []);

  useEffect(() => {
    setDrawer = _setDrawer;
  }, [_setDrawer]);

  return <context.Provider value={{ state, setDrawer: _setDrawer }}>{children}</context.Provider>;
};

export default DrawerProvider;

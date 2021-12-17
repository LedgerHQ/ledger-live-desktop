import React, { useContext, useCallback, useState, useEffect } from "react";
import { context } from "./Provider";
import { Drawer as SideDrawer } from "@ledgerhq/react-ui";

export const Drawer = () => {
  const { state, setDrawer } = useContext(context);
  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => {
    if (state?.options?.onClose) {
      state.options.onClose();
    }
    setDrawer();
  }, [setDrawer, state]);

  const onBack = useCallback(() => {
    if (state?.options?.onBack) {
      state.options.onBack();
    }
  }, [setDrawer, state]);

  // this guarantees that the transition of the open state happens after mount, and the animation is correctly triggered
  useEffect(() => {
    if (state.open) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [state.open]);

  return (
    <SideDrawer
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      footer={state?.options?.footer}
      {...state.options}
    >
      {state.Component && <state.Component {...state.componentProps} />}
    </SideDrawer>
  );
};

export default Drawer;

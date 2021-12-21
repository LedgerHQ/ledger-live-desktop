import React, { useContext, useCallback, useState, useEffect } from "react";
import { context } from "./Provider";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import { useDeviceBlocked } from "../components/DeviceAction/DeviceBlocker";

export const Drawer = () => {
  const { state, setDrawer } = useContext(context);
  const [isOpen, setIsOpen] = useState(false);
  const deviceBlocked = useDeviceBlocked();

  const onClose = useCallback(() => {
    if (deviceBlocked) {
      return;
    }
    if (state?.options?.onClose) {
      state.options.onClose();
    }
    setDrawer();
  }, [setDrawer, state, deviceBlocked]);

  const onBack = useCallback(() => {
    if (state?.options?.onBack) {
      state.options.onBack();
    }
  }, [state]);

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
      onBack={deviceBlocked ? undefined : onBack}
      {...state.options}
    >
      {state.Component && <state.Component {...state.componentProps} />}
    </SideDrawer>
  );
};

export default Drawer;

import React, { useContext, useCallback } from "react";
import { context } from "./Provider";
import { Drawer as SideDrawerV3 } from "@ledgerhq/react-ui";

export const Drawer = () => {
  const { state, setDrawer } = useContext(context);
  // TODO: add back the queue logic

  const onRequestClose = useCallback(() => setDrawer(), [setDrawer]);

  return (
    <SideDrawerV3
      isOpen={!!state.open}
      onClose={onRequestClose}
      onBack={state?.props?.onRequestBack}
      preventBackdropClick={false}
      {...state.options}
    >
      {state.Component && <state.Component {...state.props} />}
    </SideDrawerV3>
  );
};

export default Drawer;

import React, { useContext } from "react";
import { context, setDrawer } from "./Provider";
import { SideDrawer } from "~/renderer/components/SideDrawer";

export const Drawer = () => {
  const state = useContext(context);
  return (
    <SideDrawer
      isOpen={!!state.open}
      onRequestClose={() => {
        setDrawer();
      }}
      direction="left"
    >
      {state.Component ? <state.Component {...state.props} /> : null}
    </SideDrawer>
  );
};

export default Drawer;

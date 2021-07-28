import React, { useRef, useContext, useCallback, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import Drawer from "@ui/components/Layout/Drawer/Drawer";
import TransitionSlide from "@ui/components/Transition/TransitionSlide";
import { context } from "./Provider";

export const DrawerWrapper = props => {
  // Nb Note that it's not a real queue and we need to handle where we go from each _slide_
  const { state, setDrawer } = useContext(context);
  const [queue, setQueue] = useState([]);
  const [direction, setDirection] = useState("left");
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);

  const nonce = useRef(0);
  const onClose = useCallback(() => setDrawer(), [setDrawer]);

  useEffect(() => {
    setQueue(q => {
      if (!state.open) return [];
      if (state.Component) return q.concat([{ ...state, key: nonce.current++ }]);
    });
  }, [state]);

  useEffect(() => {
    let timeout;
    if (queue.length > 1) {
      const [, ...rest] = queue;
      timeout = setTimeout(() => {
        setQueue(rest);
        setDirection("left");
      }, 0);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [queue]);

  const wrappedOnBack = useCallback(() => {
    setDirection("right");
    state?.props?.onBack();
  }, [state?.props]);

  return (
    <Drawer
      isOpen={!!state.open}
      onClose={onClose}
      onBack={state?.props?.onBack ? wrappedOnBack : undefined}
      setTransitionsEnabled={setTransitionsEnabled}
      {...props}
    >
      <TransitionGroup enter={transitionsEnabled} exit={transitionsEnabled} component={null}>
        {queue.map(({ Component, props, key }, index) => (
          <TransitionSlide key={key} direction={direction}>
            <Component />
          </TransitionSlide>
        ))}
      </TransitionGroup>
    </Drawer>
  );
};

export default DrawerWrapper;

import React, { useContext, useCallback, useEffect, useState } from "react";
import { context } from "./Provider";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import styled from "styled-components";
import { Transition, TransitionGroup } from "react-transition-group";

const transitionStyles = {
  entering: {},
  entered: { transform: "translateX(0%)" },
  exiting: { opacity: 0, transform: "translateX(0%)" },
  exited: { opacity: 0 },
};

const DURATION = 200;

/** each device storage bar will grow of 0.5% if the space is available or just fill its given percent basis if the bar is filled */
const Bar = styled.div.attrs(props => ({
  style: {
    ...transitionStyles[props.state],
  },
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${p => p.index};
  transform: translateX(${p => (p.index === 0 ? 0 : 100)}%);
  transition: all ${DURATION}ms ease-in-out;
  will-change: transform;
  background-color: ${p => p.theme.colors.palette.background.paper};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
  padding: 62px 0 15px 15px;
  ${p => p.theme.overflow.y};
`;

export const Drawer = () => {
  const { state, setDrawer } = useContext(context);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    setQueue(q => {
      if (!state.open) return [];
      if (state.Component) return q.concat([state]);
      return q;
    });
  }, [state]);

  useEffect(() => {
    let t;
    if (queue.length > 1) {
      const [, ...rest] = queue;
      t = setTimeout(() => setQueue(rest), DURATION * 2);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [queue]);

  const onRequestClose = useCallback(() => setDrawer(), [setDrawer]);

  return (
    <SideDrawer
      isOpen={!!state.open}
      onRequestClose={onRequestClose}
      onRequestBack={state?.props?.onRequestBack}
      direction="left"
      {...state.options}
    >
      <>
        <TransitionGroup>
          {queue.map(({ Component, props }, index) => (
            <Transition
              timeout={{ appear: DURATION, enter: DURATION, exit: DURATION * 2 }}
              key={index}
            >
              {s => (
                <Bar state={s} index={index}>
                  <Component onClose={onRequestClose} {...props} />
                </Bar>
              )}
            </Transition>
          ))}
        </TransitionGroup>
      </>
    </SideDrawer>
  );
};

export default Drawer;

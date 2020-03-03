// @flow
import React from "react";
import styled from "styled-components";
import { Transition } from "react-transition-group";
import { connect } from "react-redux";
import { createStructuredSelector, createSelector } from "reselect";

import type { ThemedComponent } from "styled-components";

import { modalsStateSelector } from "~/renderer/reducers/modals";
import modals from "~/renderer/modals";

// TODO: SNOOOOOOOOWW
// import Snow, { isSnowTime } from '~/renderer/components/extra/Snow'

const BackDrop: ThemedComponent<{ state: string }> = styled.div.attrs(({ state }) => ({
  style: { opacity: state === "entered" ? 1 : 0 },
}))`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.3, 1, 0.5, 0.8);
`;

const ModalsLayer = ({ visibleModals }: *) => (
  <Transition
    in={visibleModals.length > 0}
    appear
    mountOnEnter
    unmountOnExit
    timeout={{
      appear: 100,
      enter: 100,
      exit: 200,
    }}
  >
    {state => (
      <BackDrop state={state}>
        {/* {// Will only render at the end of december
          isSnowTime() ? <Snow numFlakes={200} /> : null} */}
        {visibleModals.map(({ name, data }, i) => {
          const ModalComponent = modals[name];
          return <ModalComponent key={name} name={name} {...data} />;
        })}
      </BackDrop>
    )}
  </Transition>
);

const visibleModalsSelector = createSelector(modalsStateSelector, state =>
  Object.entries(state)
    .filter(([name, { isOpened }]) => !!modals[name] && isOpened)
    .map(([name, data]) => ({ name, ...data })),
);

const mapStateToProps = createStructuredSelector({
  visibleModals: visibleModalsSelector,
});

// $FlowFixMe
export default connect(mapStateToProps)(ModalsLayer);

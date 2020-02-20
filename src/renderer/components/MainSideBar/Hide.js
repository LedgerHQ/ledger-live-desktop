// @flow
import React from "react";
import { Transition } from "react-transition-group";
import styled from "styled-components";

import Box from "~/renderer/components/Box";

const hideTransitionDuration = 200;

const hideTransitionStyles = {
  entering: {
    opacity: 1,
    transition: `opacity ${hideTransitionDuration}ms`,
  },
  entered: {
    opacity: 1,
  },
  exiting: {
    opacity: 0,
    transition: `opacity ${hideTransitionDuration}ms`,
  },
  exited: {
    opacity: 0,
    width: 0,
  },
};

const HideContainer = styled(Box)`
  overflow: hidden;
`;

const Hide = ({ visible, children, ...rest }: { visible: boolean, children: any }) => (
  <Transition in={visible} timeout={hideTransitionDuration}>
    {state => (
      <HideContainer {...rest} style={hideTransitionStyles[state]}>
        {children}
      </HideContainer>
    )}
  </Transition>
);

export default Hide;

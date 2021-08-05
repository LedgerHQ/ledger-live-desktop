import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
import styled from "styled-components";
const duration = 150;
const ChildrenWrapper = styled.div`
  transition: transform ${duration}ms;

  &.transition-scale-appear {
    transform: scale(0.9);
  }

  &.transition-scale-appear-active {
    transform: scale(1);
  }

  &.transition-scale-exit {
    transform: scale(1);
  }

  &.transition-scale-exit-active {
    transform: scale(0.9);
  }
`;
type TransitionScaleProps = Partial<
  CSSTransitionProps & {
    children: React.ReactNode;
    in: boolean;
    timeout?: number;
    appear?: boolean;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
  }
>;

const TransitionScale = ({
  children,
  in: inProp,
  timeout = duration,
  ...TransitionProps
}: TransitionScaleProps) => (
  <CSSTransition {...TransitionProps} in={inProp} timeout={timeout} classNames="transition-scale">
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </CSSTransition>
);

export default TransitionScale;

import React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
import styled from "styled-components";
const duration = 300;
const ChildrenWrapper = styled.div<{ fixed?: boolean; reverseExit?: boolean }>`
  transition: all ${duration}ms ease-in-out;
  will-change: transform;
  ${(p) =>
    !p.fixed
      ? `
    position: absolute;
    width: 100%;
    `
      : ""}
  height: 100%;

  &.transition-left-appear,
  &.transition-left-enter {
    transform: translateX(100%);
  }

  &.transition-left-appear-active,
  &.transition-left-enter-active {
    transform: translateX(0%);
  }

  &.transition-left-exit {
    transform: translateX(0%);
  }

  &.transition-left-exit-active {
    transform: translateX(${(p) => (p.reverseExit ? 100 : -100)}%);
  }

  &.transition-right-appear,
  &.transition-right-enter {
    transform: translateX(-100%);
  }

  &.transition-right-appear-active,
  &.transition-right-enter-active {
    transform: translateX(0%);
  }

  &.transition-right-exit {
    transform: translateX(0%);
  }

  &.transition-right-exit-active {
    transform: translateX(${(p) => (p.reverseExit ? -100 : 100)}%);
  }
`;
type TransitionSlideProps = Partial<
  CSSTransitionProps & {
    children: React.ReactNode;
    fixed: boolean;
    reverseExit?: boolean;
    direction?: "left" | "right" | string;
  }
>;

const TransitionSlide = ({
  children,
  fixed,
  direction = "left",
  reverseExit,
  ...props
}: TransitionSlideProps) => (
  <CSSTransition {...props} timeout={duration} classNames={`transition-${direction}`}>
    <ChildrenWrapper fixed={fixed} reverseExit={reverseExit}>
      {children}
    </ChildrenWrapper>
  </CSSTransition>
);

export default TransitionSlide;

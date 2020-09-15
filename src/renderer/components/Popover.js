/* eslint-disable no-fallthrough */
// @flow
import React, { useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import type { ThemedComponent } from "../styles/StyleProvider";

import { Transition } from "react-transition-group";

const Container: ThemedComponent<{}> = styled.button.attrs(() => ({ type: "button" }))`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const transitionsOpacity = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const topPosArrow = {
  top: "100%",
  bottom: 0,
  left: "50%",
  right: "50%",
};

const leftPosArrow = {
  top: "50%",
  bottom: "50%",
  left: "100%",
  right: 0,
};

const transformStyle = {
  right: "translate(0, 50%)",
  left: "translate(-100%, 50%)",
  top: "translate(-50%, 0)",
  bottom: "translate(-50%, 100%)",
};

const clipPaths = {
  right: "inset(0 100% 0 0)",
  left: "inset(0 0 0 100%)",
  top: "inset(100% 0 0 0)",
  bottom: "inset(0 0 100% 0)",
};

const transitionsClipPath = {
  entering: (pos: string) => ({
    clipPath: clipPaths[pos],
  }),
  entered: (pos: string) => ({
    clipPath: "inset(-10px -10px -10px -10px)",
  }),
  exiting: (pos: string) => ({
    clipPath: clipPaths[pos],
  }),
  exited: (pos: string) => ({
    clipPath: clipPaths[pos],
  }),
};

const ContentWrapper: ThemedComponent<{
  left: string | number,
  bottom: string | number,
  position?: "top" | "bottom" | "left" | "right",
  state: string,
}> = styled.div.attrs(p => ({
  style: {
    bottom: p.bottom,
    left: p.left,
    ...transitionsOpacity[p.state],
    ...transitionsClipPath[p.state](p.position),
    transform: transformStyle[p.position],
  },
}))`
  display: flex;
  position: sticky;
  max-width: 400px;
  max-height: 500px;
  background-color: ${p => p.theme.colors.palette.background.default};
  border-radius: 4px;
  padding: ${p => p.theme.space[2]}px;
  transform-origin: center;
  transition: all 200ms cubic-bezier(0.3, 1, 0.5, 0.8);
  z-index: 999;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1); */
  &:before {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: inherit;
    top: ${p => topPosArrow[p.position]};
    left: ${p => leftPosArrow[p.position]};
    transform: translate(-50%, -50%) rotate(45deg);
    border: 1px solid ${p => p.theme.colors.palette.text.shade20};
    border-top: 0;
    border-right: 0;
  }
`;

const ContentContainer: ThemedComponent<{}> = styled.div`
  position: relative;
  width: 100%;
  ${p => p.theme.overflow.yAuto};
`;

type PopoverProps = {
  position?: "top" | "bottom" | "left" | "right",
  children: React$Node,
  content: React$Node,
};

const Popover = ({ position = "top", children, content }: PopoverProps) => {
  const childrenContainer = useRef();
  const [posXY, setPosXY] = useState<{ left: string | number, bottom: string | number }>({
    left: 0,
    bottom: 0,
  });
  const [visible, setVisible] = useState(false);

  const onClick = useCallback(() => {
    if (!visible && childrenContainer && childrenContainer.current) {
      const {
        top,
        right,
        bottom,
        left,
        height,
        width,
      } = childrenContainer.current.getBoundingClientRect();
      const pos = { bottom, left };
      switch (position) {
        case "right":
          pos.bottom = `calc(100% - ${top + height / 2}px)`;
          pos.left = right + 20;
          break;
        case "left":
          pos.bottom = `calc(100% - ${top + height / 2}px)`;
          pos.left = `calc(100% - ${right + 20}px)`;
          break;
        case "top":
          pos.bottom = `calc(100% - ${top - 20}px)`;
          pos.left = right - width / 2;
          break;
        case "bottom":
          pos.bottom = `calc(100% - ${bottom + 20}px)`;
          pos.left = right - width / 2;
          break;
        default:
          break;
      }
      setPosXY(pos);
    }
    setVisible(!visible);
  }, [childrenContainer, position, visible]);

  const onBlur = useCallback(() => setVisible(false), [setVisible]);

  return (
    <>
      <Container ref={childrenContainer} onClick={onClick} onBlur={onBlur}>
        {children}
      </Container>
      <Transition
        in={visible}
        appear
        mountOnEnter
        unmountOnExit
        timeout={{
          appear: 100,
          enter: 100,
          exit: 200,
        }}
      >
        {state => <Content state={state} content={content} posXY={posXY} position={position} />}
      </Transition>
    </>
  );
};

type ContentProps = {
  content: React$Node,
  state: string,
  posXY: { left: string | number, bottom: string | number },
  position?: "top" | "bottom" | "left" | "right",
};

const Content = ({ content, state, posXY: { left, bottom }, position }: ContentProps) => {
  const C = (
    <ContentWrapper state={state} position={position} left={left} bottom={bottom}>
      <ContentContainer position={position}>{content}</ContentContainer>
    </ContentWrapper>
  );

  return document.body && createPortal(C, document.body);
};

export default Popover;

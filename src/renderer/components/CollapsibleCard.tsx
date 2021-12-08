import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Box, Flex, Icons } from "@ledgerhq/react-ui";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Transition } from "react-transition-group";

const Container: ThemedComponent<{ timing: number }> = styled(Flex).attrs(() => ({
  flexDirection: "column",
  padding: 10,
}))<{ timing: number }>`
  transition: all ${p => p.timing}ms ease-in;
  border: 1px solid ${p => p.theme.colors.neutral.c40};
  border-radius: 8px;
`;

const HeaderContainer = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;

const transitionStyles = {
  entering: { opacity: 0, maxHeight: 0, overflow: "hidden" },
  entered: { opacity: 1, maxHeight: "100vh", overflow: "auto" },
  exiting: { opacity: 0, maxHeight: 0, overflow: "hidden" },
  exited: {
    opacity: 0,
    maxHeight: 0,
    overflow: "hidden",
  },
};

const ChildrenContainer = styled(Box).attrs(p => ({
  style: { ...transitionStyles[p.state] },
}))`
  transition: all ${p => p.timing}ms ease-out;
  transform-origin: top;
  height: auto;
  width: auto;
  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
`;

const Chevron = styled(Flex)<{ open: boolean; timing: number }>`
  transition: all ${p => p.timing / 2}ms ${p => p.timing / 2}ms ease-in;
  cursor: pointer;
  box-sizing: content-box;
  transform: rotate(${p => (p.open ? "0deg" : "180deg")});
  margin-right: 6px;
  justify-content: center;
  align-items: center;
`;

type Props = {
  /** header node */
  header: React.ReactNode;
  /** timing in ms for collapse animation */
  timing?: number;
  /** show header chevron */
  chevronVisible?: boolean;
  children?: React$Node;
  open?: boolean;
  onOpen?: (isOpen: boolean) => void;
};

const CollapsibleCard = ({
  header,
  children,
  timing = 400,
  chevronVisible = true,
  open: defaultOpen,
  onOpen = () => {},
  ...props
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useCallback(() => {
    setOpen(!open);
    onOpen(!open);
  }, [open, onOpen]);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <Container {...props} timing={timing}>
      <HeaderContainer onClick={toggle} chevronVisible={chevronVisible}>
        {chevronVisible && (
          <Chevron open={open} timing={timing}>
            <Icons.ChevronTopMedium size={18} color="neutral.c100" />
          </Chevron>
        )}
        {header}
      </HeaderContainer>
      <Transition
        in={open}
        timeout={{
          appear: 0,
          enter: timing,
          exit: timing * 3, // leaves extra time for the animation to end before unmount
        }}
        unmountOnExit
      >
        {state => (
          <ChildrenContainer timing={timing} state={state}>
            {children}
          </ChildrenContainer>
        )}
      </Transition>
    </Container>
  );
};

export default CollapsibleCard;

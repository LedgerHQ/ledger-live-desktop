import React, { useState, useMemo } from "react";
import SideBarContext from "@ui/components/navigation/sideBar";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import Flex from "@ui/components/layout/Flex";
import Item from "@ui/components/navigation/sideBar/Item";
import Logo from "@ui/components/navigation/sideBar/Logo";
import Toggle from "@ui/components/navigation/sideBar/Toggle";

const Nav = styled(Flex)`
  position: relative;
  padding: ${(p) => `${p.theme.space[19]}px ${p.theme.space[5]}px 0`};
  row-gap: 1.5rem;
  height: 100vh;
  max-width: 14.875rem;
  color: ${(props) => props.theme.colors.palette.neutral.c100};
  border-right: 1px solid ${(props) => props.theme.colors.palette.neutral.c90};
  background-color: ${(props) => props.theme.colors.palette.neutral.c00};
  transition: max-width 300ms;
  will-change: max-width;

  &.nav-enter {
    max-width: ${(p) => p.theme.space[19]}px;
  }
  &.nav-enter-done {
    max-width: 14.875rem;
  }
  &.nav-exit {
    max-width: 14.875rem;
  }
  &.nav-exit-done {
    max-width: ${(p) => `${p.theme.space[19]}px`};
  }
`;

export type SideBarProps = {
  children: Array<JSX.Element>;
  onToggle: () => void;
  isExpanded?: boolean;
};

const SideBar = ({ children, onToggle, isExpanded = true }: SideBarProps): JSX.Element => {
  const [isToggleDisplayed, setToggleDisplayed] = useState(false);
  const providerValue = useMemo(() => ({ isExpanded, onToggle }), [isExpanded, onToggle]);

  return (
    <SideBarContext.Provider value={providerValue}>
      <CSSTransition in={isExpanded} timeout={300} classNames="nav">
        <Nav
          flexDirection="column"
          justifyContent="flex-start"
          alignContent="stretch"
          role="navigation"
          aria-label="Main"
          onMouseEnter={() => setToggleDisplayed(true)}
          onMouseLeave={() => setToggleDisplayed(false)}
        >
          <Toggle isDisplayed={isToggleDisplayed} />
          <Logo />
          <Flex flexDirection="column" justifyContent="flex-start" alignContent="stretch">
            {children}
          </Flex>
        </Nav>
      </CSSTransition>
    </SideBarContext.Provider>
  );
};

SideBar.Item = Item;

export default SideBar;

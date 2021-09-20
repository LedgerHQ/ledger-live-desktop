import React, { useState, useMemo, createContext } from "react";
import styled from "styled-components";
import Flex from "@ui/components/Layout/Flex";
import SideBarItem from "./components/SideBarItem/SideBarItem";
import SideBarIcon from "./components/SideBarIcon/SideBarIcon";
import SideBarToggle from "./components/SideBarToggle/SideBarToggle";
import { CSSTransition } from "react-transition-group";

const Nav = styled(Flex)`
  position: relative;
  padding: 68px 12px 0;
  row-gap: 1.5rem;
  height: 100vh;
  max-width: 14.875rem;
  color: ${(props) => props.theme.colors.palette.neutral.c100};
  border-right: 1px solid ${(props) => props.theme.colors.palette.neutral.c90};
  background-color: ${(props) => props.theme.colors.palette.neutral.c00};
  transition: max-width 300ms;
  will-change: max-width;

  &.nav-enter {
    max-width: 75px;
  }
  &.nav-enter-done {
    max-width: 14.875rem;
  }
  &.nav-exit {
    max-width: 14.875rem;
  }
  &.nav-exit-done {
    max-width: 75px;
  }
`;

export type SideBarProps = {
  children: Array<JSX.Element>;
  onToggle: () => void;
  isExpanded?: boolean;
};

type SideBarContextType = { isExpanded: boolean; onToggle: () => void };
export const SideBarContext = createContext<Partial<SideBarContextType>>({});

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
          <SideBarToggle isDisplayed={isToggleDisplayed} />
          <SideBarIcon />
          <Flex flexDirection="column" justifyContent="flex-start" alignContent="stretch">
            {children}
          </Flex>
        </Nav>
      </CSSTransition>
    </SideBarContext.Provider>
  );
};

SideBar.Item = SideBarItem;

export default SideBar;

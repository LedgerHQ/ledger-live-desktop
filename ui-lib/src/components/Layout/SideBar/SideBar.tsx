import React, { useState, createContext } from "react";
import styled from "styled-components";
import Flex from "@ui/components/Layout/Flex";
import SideBarItem from "./components/SideBarItem/SideBarItem";
import SideBarIcon from "./components/SideBarIcon/SideBarIcon";
import SideBarToggle from "./components/SideBarToggle/SideBarToggle";
import { CSSTransition } from "react-transition-group";

/* TODO: Create a resize transition ? */
const Nav = styled(Flex)`
  position: relative;
  padding: 68px 12px 0;
  row-gap: 1.5rem;
  height: 100vh;
  max-width: 14.875rem;
  color: ${props => props.theme.colors.palette.v2.text.default};
  border-right: 1px solid ${props => props.theme.colors.palette.v2.grey.border};
  background-color: ${props => props.theme.colors.palette.v2.background.paper};
  transition: max-width 300ms;
  will-change: max-width;

  &.my-node-enter {
    max-width: 75px;
  }
  &.my-node-enter-done {
    max-width: 14.875rem;
  }
  &.my-node-exit {
    max-width: 14.875rem;
  }
  &.my-node-exit-done {
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

  return (
    <SideBarContext.Provider value={{ isExpanded, onToggle }}>
      <CSSTransition in={isExpanded} timeout={300} classNames="my-node">
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

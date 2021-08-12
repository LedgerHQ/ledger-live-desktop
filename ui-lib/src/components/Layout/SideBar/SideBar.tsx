import React, { useState } from "react";
import styled from "styled-components";
import Flex from "@ui/components/Layout/Flex";
import SideBarItem from "./components/SideBarItem/SideBarItem";
import SideBarIcon from "./components/SideBarIcon/SideBarIcon";
import SideBarToggle from "./components/SideBarToggle/SideBarToggle";

const Nav = styled(Flex)`
  position: relative;
  padding: 68px 12px 0;
  row-gap: 1.5rem;
  max-width: 14.875rem;
  height: 100vh;
  color: ${props => props.theme.colors.palette.v2.text.default};
  border-right: 1px solid ${props => props.theme.colors.palette.v2.grey.border};
  background-color: ${props => props.theme.colors.palette.v2.background.paper};
`;

export type SideBarProps = {
  children: Array<JSX.Element>;
  onToggle: () => void;
  isExpanded?: boolean;
};

const SideBar = ({ children, onToggle, isExpanded = true }: SideBarProps): JSX.Element => {
  const [isToggleDisplayed, setToggleDisplayed] = useState(false);

  return (
    <Nav
      flexDirection="column"
      justifyContent="flex-start"
      alignContent="stretch"
      role="navigation"
      aria-label="Main"
      onMouseEnter={() => setToggleDisplayed(true)}
      onMouseLeave={() => setToggleDisplayed(false)}
    >
      <SideBarToggle onClick={onToggle} isDisplayed={isToggleDisplayed} isExpanded={isExpanded} />
      <SideBarIcon />
      <Flex flexDirection="column" justifyContent="flex-start" alignContent="stretch">
        {children}
      </Flex>
    </Nav>
  );
};

SideBar.Item = SideBarItem;

export default SideBar;

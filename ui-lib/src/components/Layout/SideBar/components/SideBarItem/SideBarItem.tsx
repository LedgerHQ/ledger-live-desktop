import React, { useContext } from "react";
import styled from "styled-components";
import Text from "@ui/components/Text";
import { SideBarContext } from "@ui/components/Layout/SideBar/SideBar";
import TransitionInOut from "@ui/components/Transition/TransitionInOut";

const Item = styled.li`
  /** DEFAULT VARIANT **/
  --ll-sidebar-item-label-color: ${(props) => props.theme.colors.palette.neutral.c80};
  --ll-sidebar-item-icon-color: ${(props) => props.theme.colors.palette.neutral.c80};
  --ll-sidebar-item-background-color: unset;

  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  min-height: 52px;

  color: var(--ll-sidebar-item-icon-color);
  background-color: var(--ll-sidebar-item-background-color);
  cursor: pointer;

  /** HOVER VARIANT **/
  &:hover {
    --ll-sidebar-item-label-color: ${(props) => props.theme.colors.palette.neutral.c100};
    --ll-sidebar-item-icon-color: ${(props) => props.theme.colors.palette.primary.c160};
    --ll-sidebar-item-background-color: unset;
  }

  /** FOCUS VARIANT **/
  &:focus {
    box-shadow: 0px 0px 0px 4px rgba(187, 176, 255, 0.4);
    border-radius: 8px;
  }

  /** ACTIVE VARIANT **/
  &[data-active] {
    --ll-sidebar-item-label-color: ${(props) => props.theme.colors.palette.neutral.c100};
    --ll-sidebar-item-icon-color: ${(props) => props.theme.colors.palette.primary.c160};
    --ll-sidebar-item-background-color: ${(props) => props.theme.colors.palette.primary.c20};
  }

  /** DISABLE VARIANT **/
  &[data-disable] {
    --ll-sidebar-item-label-color: ${(props) => props.theme.colors.palette.neutral.c80};
    --ll-sidebar-item-icon-color: ${(props) => props.theme.colors.palette.neutral.c80};
    --ll-sidebar-item-background-color: unset;
    opacity: 0.3;
    cursor: unset;
  }
`;

export const SideBarItemLabel = styled(Text)`
  display: inline-block;
  color: var(--ll-sidebar-item-label-color);

  text-transform: capitalize;
`;

export type SideBarItemType = {
  label: string;
  children: JSX.Element;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

const SideBarItem = ({
  label,
  children,
  onClick,
  isActive,
  isDisabled,
}: SideBarItemType): JSX.Element => {
  const { isExpanded } = useContext(SideBarContext);

  const handleClick = () => {
    if (isDisabled) return;
    onClick();
  };

  return (
    <Item
      role="button"
      onClick={handleClick}
      data-active={isActive}
      data-disable={isDisabled}
      tabIndex={0}
    >
      {children}
      <TransitionInOut
        timeout={300}
        in={isExpanded}
        unmountOnExit
        mountOnEnter
        style={{ transitionDelay: isExpanded ? "300ms" : 0 }}
      >
        <SideBarItemLabel type="cta">{label}</SideBarItemLabel>
      </TransitionInOut>
    </Item>
  );
};

export default SideBarItem;

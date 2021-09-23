import React, { useContext } from "react";
import styled from "styled-components";
import SideBarContext from "@ui/components/navigation/sideBar";
import Text from "@ui/components/asorted/Text";
import TransitionInOut from "@ui/components/transitions/TransitionInOut";

const ItemWrapper = styled.li`
  /** DEFAULT VARIANT **/
  --ll-sidebar-item-label-color: ${(props) => props.theme.colors.palette.neutral.c80};
  --ll-sidebar-item-icon-color: ${(props) => props.theme.colors.palette.neutral.c80};
  --ll-sidebar-item-background-color: unset;

  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${(p) => p.theme.space[3]}px;
  column-gap: ${(p) => p.theme.space[5]}px;
  padding: ${(p) => p.theme.space[5]}px;
  border-radius: ${(p) => p.theme.space[3]}px;
  min-height: ${(p) => p.theme.space[13]}px;
  min-width: ${(p) => p.theme.space[13]}px;

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
    border-radius: ${(p) => p.theme.space[3]}px;
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

export const ItemLabel = styled(Text)`
  display: inline-block;
  color: var(--ll-sidebar-item-label-color);

  text-transform: capitalize;
`;

export type ItemType = {
  label: string;
  children: JSX.Element;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

const Item = ({ label, children, onClick, isActive, isDisabled }: ItemType): JSX.Element => {
  const { isExpanded } = useContext(SideBarContext);

  const handleClick = () => {
    if (isDisabled) return;
    onClick();
  };

  return (
    <ItemWrapper
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
        <ItemLabel type="cta">{label}</ItemLabel>
      </TransitionInOut>
    </ItemWrapper>
  );
};

export default Item;

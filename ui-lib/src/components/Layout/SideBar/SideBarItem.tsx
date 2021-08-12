import React from "react";
import styled from "styled-components";
import Text from "@ui/components/Text";

const Item = styled.li`
  /** DEFAULT VARIANT **/
  --ll-sidebar-item-label-color: ${props => props.theme.colors.palette.v2.text.secondary};
  --ll-sidebar-item-icon-color: ${props => props.theme.colors.palette.v2.text.secondary};
  --ll-sidebar-item-background-color: unset;

  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;

  color: var(--ll-sidebar-item-icon-color);
  background-color: var(--ll-sidebar-item-background-color);
  cursor: pointer;

  /** HOVER VARIANT **/
  &:hover {
    --ll-sidebar-item-label-color: ${props => props.theme.colors.palette.v2.text.default};
    --ll-sidebar-item-icon-color: ${props => props.theme.colors.palette.v2.primary.dark};
    --ll-sidebar-item-background-color: unset;
  }

  /** ACTIVE VARIANT **/
  &[data-active] {
    --ll-sidebar-item-label-color: ${props => props.theme.colors.palette.v2.text.default};
    --ll-sidebar-item-icon-color: ${props => props.theme.colors.palette.v2.primary.dark};
    --ll-sidebar-item-background-color: ${props =>
      props.theme.colors.palette.v2.primary.backgroundLight};
  }

  /** DISABLE VARIANT **/
  &[data-disable] {
    --ll-sidebar-item-label-color: ${props => props.theme.colors.palette.v2.text.secondary};
    --ll-sidebar-item-icon-color: ${props => props.theme.colors.palette.v2.text.secondary};
    --ll-sidebar-item-background-color: unset;
    opacity: 0.3;
    cursor: unset;
  }
`;

const Label = styled(Text)`
  color: var(--ll-sidebar-item-label-color);

  &:first-letter {
    text-transform: uppercase;
  }
`;

export type SideBarItemType = {
  label: string;
  children: JSX.Element;
  onClick: () => void;
  isActive?: boolean;
  isDisable?: boolean;
};

const SideBarItem = ({
  label,
  children,
  onClick,
  isActive,
  isDisable,
}: SideBarItemType): JSX.Element => {
  const handleClick = () => {
    if (isDisable) return;
    onClick();
  };

  return (
    <Item role="button" onClick={handleClick} data-active={isActive} data-disable={isDisable}>
      {children}
      <Label type="cta">{label}</Label>
    </Item>
  );
};

export default SideBarItem;

import React, { useContext } from "react";
import styled from "styled-components";

import ArrowLeftIcon from "@ui/assets/icons/ArrowLeft";
import ArrowRightIcon from "@ui/assets/icons/ArrowRight";
import TransitionInOut from "@ui/components/Transition/TransitionInOut";
import { SideBarContext } from "@ui/components/Layout/SideBar/SideBar";

const ToggleButtonContainer = styled(TransitionInOut)`
  --ll-side-bar-toggle-button-size: 36px;

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: var(--ll-side-bar-toggle-button-size);
  right: calc(var(--ll-side-bar-toggle-button-size) / -2);
  cursor: pointer;

  background: ${p => p.theme.colors.palette.v2.text.contrast};
  border: 1px solid ${p => p.theme.colors.palette.v2.text.default};
  border-radius: 50%;
  width: var(--ll-side-bar-toggle-button-size);
  height: var(--ll-side-bar-toggle-button-size);
`;

type ToggleButtonProps = { isDisplayed: boolean };
const ToggleButton = ({ isDisplayed }: ToggleButtonProps): JSX.Element => {
  const { isExpanded, onToggle } = useContext(SideBarContext);

  return (
    <ToggleButtonContainer timeout={200} in={isDisplayed} appear unmountOnExit onClick={onToggle}>
      {isExpanded ? <ArrowLeftIcon /> : <ArrowRightIcon />}
    </ToggleButtonContainer>
  );
};

export default ToggleButton;

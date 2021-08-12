import React from "react";
import styled from "styled-components";

import ArrowLeftIcon from "@ui/assets/icons/ArrowLeft";
import ArrowRightIcon from "@ui/assets/icons/ArrowRight";
import TransitionInOut from "@ui/components/Transition/TransitionInOut";

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

type ToggleButtonProps = { onClick: () => void; isDisplayed: boolean; isExpanded?: boolean };
const ToggleButton = ({ onClick, isDisplayed, isExpanded }: ToggleButtonProps): JSX.Element => (
  <ToggleButtonContainer in={isDisplayed} appear mountOnEnter unmountOnExit onClick={onClick}>
    {isExpanded ? <ArrowLeftIcon /> : <ArrowRightIcon />}
  </ToggleButtonContainer>
);

export default ToggleButton;

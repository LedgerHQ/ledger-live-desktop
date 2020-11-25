// @flow

import React from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Check from "~/renderer/icons/Check";
import { Tabbable } from "~/renderer/components/Box";

const Base: ThemedComponent<{
  isChecked?: boolean,
  isRadio?: boolean,
}> = styled(Tabbable).attrs(() => ({
  relative: true,
  alignItems: "center",
  justifyContent: "center",
}))`
  & input[type="checkbox"] {
    display: none;
  }
  outline: none;
  border-radius: ${p => (p.isRadio ? 24 : 4)}px;
  cursor: pointer;
  background-color: ${p => (p.isChecked ? p.theme.colors.wallet : "rgba(0,0,0,0)")};
  border: 1px solid
    ${p =>
      p.isChecked ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade60};
  color: ${p => (p.isChecked ? p.theme.colors.palette.primary.contrastText : "rgba(0,0,0,0)")};
  height: ${p => (p.isRadio ? 24 : 18)}px;
  width: ${p => (p.isRadio ? 24 : 18)}px;
  transition: all ease-in-out 0.1s;
  &:focus {
    box-shadow: 0 0 4px 1px ${p => p.theme.colors.wallet};
    border-color: ${p => p.theme.colors.wallet};
  }
  &:hover {
    border-color: ${p => p.theme.colors.wallet};
  }
  ${p => (p.disabled ? `pointer-events: none; cursor: default;` : "")}
`;

type Props = {
  isChecked: boolean,
  onChange?: Function,
  isRadio?: boolean,
  disabled?: boolean,
};

function CheckBox(props: Props) {
  const { isChecked, onChange, isRadio, disabled } = props;
  return (
    <Base
      {...props}
      isRadio={isRadio}
      isChecked={isChecked}
      disabled={disabled}
      onClick={e => {
        e.stopPropagation();
        onChange && onChange(!isChecked);
      }}
    >
      <input type="checkbox" disabled={disabled || null} defaultChecked={isChecked || false} />
      <Check size={12} />
    </Base>
  );
}

export default CheckBox;

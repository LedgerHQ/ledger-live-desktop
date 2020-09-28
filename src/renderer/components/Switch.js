// @flow

import React from "react";
import noop from "lodash/noop";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Tabbable } from "~/renderer/components/Box";

const Base: ThemedComponent<{
  isChecked?: boolean,
  small?: boolean,
  disabled?: boolean,
}> = styled(Tabbable).attrs(p => ({
  bg: p.isChecked ? "wallet" : "palette.text.shade10",
  horizontal: true,
  alignItems: "center",
}))`
  & input[type="checkbox"] {
    display: none;
  }
  width: ${p => (p.small ? 25 : 40)}px;
  height: ${p => (p.small ? 13 : 24)}px;
  border-radius: 13px;
  opacity: ${p => (p.disabled ? 0.3 : 1)};
  transition: 250ms linear background-color;
  cursor: ${p => (p.disabled ? "cursor" : "pointer")};
  &:focus {
    outline: none;
  }
`;

const Ball = styled.div`
  width: ${p => (p.small ? 9 : 20)}px;
  height: ${p => (p.small ? 9 : 20)}px;
  border-radius: 50%;
  background: ${p => p.theme.colors.palette.primary.contrastText};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  transition: 250ms ease-in-out transform;
  transform: translate3d(
    ${p => (p.small ? (p.isChecked ? "14px" : "2px") : p.isChecked ? "18px" : "2px")},
    0,
    0
  );
`;

type Props = {
  isChecked: boolean,
  disabled?: boolean,
  onChange?: Function,
  small?: boolean,
};

export default function Switch({ isChecked, onChange = noop, small, disabled, ...p }: Props) {
  return (
    <Base
      {...p}
      key={isChecked ? "ON" : "OFF"}
      disabled={disabled}
      small={small}
      isChecked={isChecked}
      onClick={() => onChange(!isChecked)}
      className="switch"
    >
      <input
        type="checkbox"
        disabled={disabled || null}
        checked={isChecked}
        readOnly
        value={isChecked}
      />
      <Ball small={small} isChecked={isChecked} />
    </Base>
  );
}

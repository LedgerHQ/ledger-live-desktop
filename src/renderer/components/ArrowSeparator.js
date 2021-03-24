// @flow

import React, { useState, useCallback } from "react";
import styled from "styled-components";
import IconTransfer from "~/renderer/icons/Transfer";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const ArrowSeparatorWrapper: ThemedComponent<{ horizontal: boolean }> = styled.div`
  display: flex;
  flex-direction: ${p => (p.horizontal ? "row" : "column")};
  align-items: center;
  & > div {
    flex: 1;
    ${p => (p.horizontal ? "height" : "width")}: 1px;
    background: ${p => p.theme.colors.palette.divider};
    &:nth-of-type(2) {
      color: ${p =>
        p.disabled ? p.theme.colors.palette.divider : p.theme.colors.palette.primary.main};
      flex: unset;
      display: flex;
      align-items: center;
      height: 36px;
      width: 36px;
      padding: 6px;
      border-radius: 36px;
      background: transparent;
      justify-content: center;
      border: 1px solid ${p => p.theme.colors.palette.divider};
      transition: border 150ms ease-in;
      &:hover {
        cursor: ${p => (p.disabled ? "auto" : "pointer")};
        border-color: ${p => (p.disabled ? "auto" : p.theme.colors.palette.primary.main)};
      }
    }
  }
`;

type Props = {
  onClick?: () => any,
  horizontal?: boolean,
  disabled?: boolean,
  Icon?: any,
  size?: number,
  style?: any,
};

const ArrowSeparator: React$ComponentType<Props> = React.memo(function ArrowSeparator({
  onClick,
  horizontal,
  disabled,
  Icon = IconTransfer,
  size = 16,
  style,
}: Props) {
  const [nonce, drop] = useState(0);
  const onClickWrapper = useCallback(() => {
    if (!disabled && onClick) {
      drop(nonce + 1);
      onClick();
    }
  }, [disabled, nonce, onClick]);

  return (
    <ArrowSeparatorWrapper disabled={!!onClick && disabled} horizontal={!!horizontal} style={style}>
      <div />
      <div onClick={onClickWrapper}>
        <Icon size={size} disabled={disabled} />
      </div>
      <div />
    </ArrowSeparatorWrapper>
  );
});

export default ArrowSeparator;

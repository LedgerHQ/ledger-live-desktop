// @flow

import React, { useState, useCallback } from "react";
import styled from "styled-components";
import IconTransfer from "~/renderer/icons/Transfer";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useSpring, animated } from "react-spring";

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

const ArrowSeparator = ({
  onClick,
  horizontal,
  disabled,
  Icon = IconTransfer,
  size = 16,
  style,
}: {
  onClick?: () => any,
  horizontal?: boolean,
  disabled?: boolean,
  Icon?: any,
  size?: number,
  style?: any,
}) => {
  const [nonce, drop] = useState(0);
  const { angle } = useSpring({
    from: { angle: 0 },
    to: { angle: nonce * 180 },
    config: { mass: 5, tension: 500, friction: 80 },
  });
  const onClickWrapper = useCallback(() => {
    if (!disabled && onClick) {
      drop(nonce + 1);
      onClick();
    }
  }, [disabled, nonce, onClick]);

  return (
    <ArrowSeparatorWrapper
      disabled={!!onClick && disabled}
      horizontal={!!horizontal}
      onClick={onClickWrapper}
      style={style}
    >
      <div />
      <animated.div
        style={{
          transform: angle.interpolate(d => `rotateZ(${d}deg)`),
        }}
      >
        <Icon size={size} />
      </animated.div>
      <div />
    </ArrowSeparatorWrapper>
  );
};

export default ArrowSeparator;

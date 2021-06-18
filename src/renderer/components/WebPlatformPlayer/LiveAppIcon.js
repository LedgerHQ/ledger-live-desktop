// @flow
import React, { useState, useCallback } from "react";
import styled, { css } from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  size: number,
  disabled?: boolean,
  icon?: string,
  name: string,
};

export const IconWrapper: ThemedComponent<{
  size: number,
  disabled?: boolean,
}> = styled.div`
  font-size: ${p => p.size / 2}px;
  font-family: "Inter";
  font-weight: bold;
  color: ${p => p.theme.colors.palette.secondary.main};
  background-color: ${p => p.theme.colors.palette.background.paper};
  box-shadow: inset 0 0 0 1px ${p => p.theme.colors.palette.divider};
  border-radius: 8px;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: ${p => p.size}px;
  height: ${p => p.size}px;

  > img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    width: ${p => p.size}px;
    height: ${p => p.size}px;
  }

  ${p =>
    p.loaded &&
    css`
      > img {
        opacity: 1;
      }
    `}

  filter: ${p => (p.disabled ? "grayscale(100%)" : "")};
`;

const LiveAppIcon = ({ size, disabled, icon, name }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <IconWrapper size={size} loaded={imageLoaded}>
      {!imageLoaded && name[0].toUpperCase()}
      {icon && <img src={icon} onLoad={handleImageLoad} />}
    </IconWrapper>
  );
};

export default LiveAppIcon;

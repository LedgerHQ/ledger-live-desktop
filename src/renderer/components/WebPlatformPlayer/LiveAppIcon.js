// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { PlatformsConfig } from "./config";

type Props = {
  platform: string,
  size: number,
  disabled?: boolean,
};

export const IconWrapper: ThemedComponent<{
  size: number,
  inactive?: boolean,
}> = styled.div`
  font-size: ${p => p.size / 2}px;
  font-family: "Inter";
  font-weight: bold;
  color: ${p => p.theme.colors.palette.secondary.main};
  background-color: ${p => p.theme.colors.palette.background.default};
  border-radius: 4px;
  border-radius: ${p => (p.circle ? "50%" : "4px")};
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &,
  & > img {
    width: ${p => p.size}px;
    height: ${p => p.size}px;
  }

  filter: ${p => (p.disabled ? "grayscale(100%)" : "")};
`;

const LiveAppIcon = ({ platform, size, disabled }: Props) => {
  const platformConfig = PlatformsConfig[platform];

  return (
    <IconWrapper size={size}>
      {platformConfig?.icon ? (
        <img src={platformConfig?.icon} />
      ) : (
        platformConfig?.name[0].toUpperCase() || "?"
      )}
    </IconWrapper>
  );
};

export default LiveAppIcon;

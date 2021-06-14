// @flow
import React from "react";
import styled from "styled-components";
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

const LiveAppIcon = ({ size, disabled, icon, name }: Props) => {
  return (
    <IconWrapper size={size}>
      {icon ? <img src={icon} /> : name[0].toUpperCase() || "?"}
    </IconWrapper>
  );
};

export default LiveAppIcon;

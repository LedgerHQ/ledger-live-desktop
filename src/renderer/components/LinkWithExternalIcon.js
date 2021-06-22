// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import externalLink from "~/renderer/images/external-link.svg";

import Label from "./Label";

const Wrapper: ThemedComponent<{}> = styled(Label).attrs(props => ({
  ff: "Inter|SemiBold",
  color: props.color,
  fontSize: props.fontSize,
  alignItems: "center",
}))`
  cursor: pointer;
  display: inline-flex;
  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }

  &:after {
    -webkit-mask: url(${externalLink});
    -webkit-mask-size: cover;
    width: 12px;
    height: 12px;
    vertical-align: baseline;
    margin-left: 6px;
    content: "";
    display: inline-block;
    background: currentColor;
  }
`;

type Props = {
  onClick: ?() => void,
  label?: React$Node,
  children?: React$Node,
  style?: *,
  fontSize?: number,
  color?: string,
};

// can add more dynamic options if needed
export function LinkWithExternalIcon({
  onClick,
  label,
  children,
  style,
  fontSize,
  color = "wallet",
}: Props) {
  return (
    <Wrapper onClick={onClick} style={style} fontSize={fontSize || 4} color={color}>
      {label || children}
    </Wrapper>
  );
}

export default LinkWithExternalIcon;

// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import IconExternalLink from "~/renderer/icons/ExternalLink";

import Label from "./Label";
import { rgba } from "~/renderer/styles/helpers";

const Wrapper: ThemedComponent<{}> = styled(Label).attrs(props => ({
  ff: "Inter|SemiBold",
  color: "wallet",
  fontSize: props.fontSize,
  alignItems: "center",
}))`
  display: flex;
  cursor: pointer;

  &:hover {
    color: ${p => rgba(p.theme.colors.wallet, 0.9)};
  }
`;

type Props = {
  onClick: ?() => void,
  label?: React$Node,
  children?: React$Node,
  style?: *,
  fontSize?: number,
};

// can add more dynamic options if needed
export function LinkWithExternalIcon({ onClick, label, children, style, fontSize }: Props) {
  return (
    <Wrapper onClick={onClick} style={style} fontSize={fontSize || 4}>
      <span>{label || children}</span>
      <Box ml={1}>
        <IconExternalLink size={12} />
      </Box>
    </Wrapper>
  );
}

export default LinkWithExternalIcon;

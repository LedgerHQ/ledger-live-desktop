// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

type Props = {
  icon: any,
};
class LedgerLiveLogo extends PureComponent<Props> {
  render() {
    const { icon, ...p } = this.props;
    return (
      <LiveLogoContainer {...p} data-test-id="logo">
        {icon}
      </LiveLogoContainer>
    );
  }
}

const LiveLogoContainer: ThemedComponent<{
  width?: number,
  height?: number,
}> = styled(Box).attrs(() => ({
  borderRadius: "4px",
  alignItems: "center",
  justifyContent: "center",
}))`
  color: ${p => p.theme.colors.palette.secondary.main};
  background-color: ${p => p.theme.colors.palette.primary.contrastText};
  box-shadow: 0 2px 24px 0 #00000014;
  width: ${p => (p.width ? p.width : "80px")};
  height: ${p => (p.height ? p.height : "80px")};
`;

export default LedgerLiveLogo;

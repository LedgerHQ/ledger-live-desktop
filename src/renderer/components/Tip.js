// @flow

import React from "react";
import styled from "styled-components";
import Box from "./Box";
import InfoCircle from "~/renderer/icons/InfoCircle";
import useTheme from "~/renderer/hooks/useTheme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const TokenTipsContainer: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.pillActiveBackground};
  border-radius: 4px;
  color: ${p => p.theme.colors.wallet};
  font-weight: 400;
  padding: 16px;
  line-height: 1.38;
`;

const Tip = ({ children }: *) => (
  <TokenTipsContainer mt={4} horizontal alignItems="center">
    <InfoCircle size={16} color={useTheme("colors.palette.primary.main")} />
    <div style={{ flex: 1, marginLeft: 20 }}>{children}</div>
  </TokenTipsContainer>
);

export default Tip;

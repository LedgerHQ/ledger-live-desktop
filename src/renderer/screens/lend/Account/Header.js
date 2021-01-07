// @flow

import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px 20px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
`;

export const TableLine: ThemedComponent<{}> = styled(Text).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade60",
  fontSize: 3,
}))`
  flex: 1.25;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  justify-content: flex-start;
  &:last-child {
    flex: 0.75;
  }
`;

const Header = ({ type }: { type: "open" | "close" }) => (
  <Wrapper>
    <TableLine>
      <Trans i18nKey={`lend.account.${type === "close" ? "amountRedeemed" : "amountSupplied"}`} />
    </TableLine>
    <TableLine>
      <Trans i18nKey="lend.account.interestEarned" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="lend.account.date" />
    </TableLine>
  </Wrapper>
);

export default Header;

// @flow

import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { HeaderWrapper } from "~/renderer/components/TableContainer";

export const TableLine: ThemedComponent<{}> = styled(Text).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade50",
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

const Header = ({ type }: { type: "open" | "close" }) => {
  const key = type === "close" ? "amountRedeemed" : "amountSupplied";
  return (
    <HeaderWrapper>
      <TableLine>
        <Trans i18nKey={`lend.account.${key}`} />
      </TableLine>
      <TableLine>
        <Trans i18nKey="lend.account.interestEarned" />
      </TableLine>
      <TableLine>
        <Trans i18nKey="lend.account.date" />
      </TableLine>
    </HeaderWrapper>
  );
};

export default Header;

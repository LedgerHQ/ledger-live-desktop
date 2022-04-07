// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box/Box";
import { HeaderWrapper } from "~/renderer/components/TableContainer";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const TableLine: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade60",
  horizontal: true,
  alignItems: "center",
  justifyContent: "flex-start",
  fontSize: 3,
  flex: 1.125,
  pr: 2,
}))`
  box-sizing: border-box;
  &:last-child {
    justify-content: flex-end;
    flex: 0.5;
    text-align: right;
    white-space: nowrap;
  }
`;

export const Header = () => (
  <HeaderWrapper>
    <TableLine>
      <Trans i18nKey="delegation.validator" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="delegation.status" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="delegation.delegated" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="solana.delegation.active" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="solana.delegation.availableBalance" />
    </TableLine>
    <TableLine />
  </HeaderWrapper>
);

export const UnbondingHeader = () => (
  <HeaderWrapper>
    <TableLine>
      <Trans i18nKey="delegation.validator" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="delegation.status" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="delegation.delegated" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="delegation.completionDate" />
    </TableLine>
  </HeaderWrapper>
);

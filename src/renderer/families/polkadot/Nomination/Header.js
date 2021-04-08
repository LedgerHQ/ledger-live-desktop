// @flow

import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { HeaderWrapper } from "~/renderer/components/TableContainer";

export const TableLine: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade60",
  horizontal: true,
  alignItems: "center",
  justifyContent: "flex-start",
  fontSize: 3,
  flex: 1,
  shrink: 1,
  pr: 2,
}))`
  box-sizing: border-box;
  &:last-child {
    justify-content: flex-end;
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
      <Trans i18nKey="polkadot.nomination.commission" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="polkadot.nomination.totalStake" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="polkadot.nomination.amount" />
    </TableLine>
  </HeaderWrapper>
);

export const UnlockingHeader = () => (
  <HeaderWrapper>
    <TableLine>
      <Trans i18nKey="delegation.value" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="delegation.completionDate" />
    </TableLine>
  </HeaderWrapper>
);

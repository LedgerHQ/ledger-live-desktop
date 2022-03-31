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
      <Trans i18nKey="delegation.rewards" />
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

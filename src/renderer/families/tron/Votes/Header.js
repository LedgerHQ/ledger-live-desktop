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
    flex: 0.5;
  }
`;

const Header = () => (
  <Wrapper>
    <TableLine>
      <Trans i18nKey="delegation.validator" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="delegation.amount" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="tron.voting.percentageTP" />
    </TableLine>
    <TableLine>
      <Trans i18nKey="delegation.duration" />
    </TableLine>
  </Wrapper>
);

export default Header;

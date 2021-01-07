// @flow

import React, { useCallback } from "react";
import styled from "styled-components";

import { getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { ExplorerView } from "@ledgerhq/live-common/lib/types";

import { openURL } from "~/renderer/linking";
import Ellipsis from "~/renderer/components/Ellipsis";

import { TableLine } from "./Header";
import Trophy from "~/renderer/icons/Trophy";
import Medal from "~/renderer/icons/Medal";
import Discreet from "~/renderer/components/Discreet";

const Wrapper: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
`;

const Column: ThemedComponent<{ clickable?: boolean }> = styled(TableLine).attrs(p => ({
  ff: "Inter|SemiBold",
  color: p.strong ? "palette.text.shade100" : "palette.text.shade80",
  fontSize: 3,
}))`
  cursor: ${p => (p.clickable ? "pointer" : "cursor")};
`;

type Props = {
  validator: *,
  address: string,
  isSR: boolean,
  amount: React$Node,
  duration: React$Node,
  percentTP: React$Node,
  currency: *,
  explorerView: ?ExplorerView,
};

const IconContainer = styled.div`
  display: flex;
  margin-right: 15px;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${p =>
    p.isSR ? p.theme.colors.palette.action.hover : p.theme.colors.palette.divider};
  color: ${p =>
    p.isSR ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade60};
`;

const Row = ({
  validator,
  address,
  amount,
  isSR,
  duration,
  percentTP,
  currency,
  explorerView,
}: Props) => {
  const srURL = explorerView && getAddressExplorer(explorerView, address);

  const openSR = useCallback(() => {
    if (srURL) openURL(srURL);
  }, [srURL]);

  return (
    <Wrapper>
      <Column strong clickable onClick={openSR}>
        <IconContainer isSR={isSR}>
          {isSR ? <Trophy size={16} /> : <Medal size={16} />}
        </IconContainer>
        <Ellipsis>{validator ? validator.name : address}</Ellipsis>
      </Column>
      <Column>
        <Discreet>{amount}</Discreet>
      </Column>
      <Column>{percentTP}%</Column>
      <Column>{duration}</Column>
    </Wrapper>
  );
};

export default Row;

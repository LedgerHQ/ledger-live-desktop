// @flow

import React, { useCallback } from "react";
import styled from "styled-components";

import { getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { ExplorerView } from "@ledgerhq/live-common/lib/types";

import { openURL } from "~/renderer/linking";
import Ellipsis from "~/renderer/components/Ellipsis";

import { TableLine } from "./Header";

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
  amount: React$Node,
  duration: React$Node,
  percentTP: React$Node,
  currency: *,
  explorerView: ?ExplorerView,
};

const Row = ({
  validator,
  address,
  amount,
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
        <Ellipsis>{validator ? validator.name : address}</Ellipsis>
      </Column>
      <Column>{amount}</Column>
      <Column>{percentTP}%</Column>
      <Column>{duration}</Column>
    </Wrapper>
  );
};

export default Row;

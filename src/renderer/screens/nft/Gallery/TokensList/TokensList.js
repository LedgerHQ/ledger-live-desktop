// @flow

import React, { memo } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, NFT } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import { useSelector } from "react-redux";
import { nftsViewModeSelector } from "~/renderer/reducers/settings";
import Item from "./Item";

type Props = {
  account: Account,
  isLoading?: boolean,
  nfts: NFT[],
  onHideCollection?: () => void,
};

const Container: ThemedComponent<{ mode?: "grid" | "list" }> = styled(Box)`
  display: ${p => (p.mode === "list" ? "flex" : "grid")};
  grid-gap: ${p => (p.mode === "list" ? 10 : 18)}px;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
`;

const TokensList = ({ account, isLoading, nfts, onHideCollection }: Props) => {
  const nftsViewMode = useSelector(nftsViewModeSelector);

  return (
    <Container mb={20} mode={nftsViewMode}>
      {nfts.map(nft => (
        <Item
          key={nft.id}
          mode={nftsViewMode}
          id={nft.id}
          account={account}
          onHideCollection={onHideCollection}
        />
      ))}
    </Container>
  );
};

export default memo<Props>(TokensList);

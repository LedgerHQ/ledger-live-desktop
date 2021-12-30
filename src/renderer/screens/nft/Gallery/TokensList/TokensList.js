// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, NFT } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import { useSelector } from "react-redux";
import { nftsViewModeSelector } from "~/renderer/reducers/settings";
import Spinner from "~/renderer/components/Spinner";
import Item from "./Item";

type Props = {
  account: Account,
  collectionId: string,
  isLoading?: boolean,
  nfts: NFT[],
};

const Container: ThemedComponent<{ mode?: "grid" | "list" }> = styled(Box)`
  display: ${p => (p.mode === "list" ? "flex" : "grid")};
  grid-gap: ${p => (p.mode === "list" ? 10 : 18)}px;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
`;

const SpinnerContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SpinnerBackground: ThemedComponent<{}> = styled.div`
  background: ${p => p.theme.colors.palette.background.paper};
  border-radius: 100%;
  padding: 2px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${p => p.theme.colors.palette.background.paper};
`;

const TokensList = ({ account, isLoading, nfts, collectionId }: Props) => {
  const nftsViewMode = useSelector(nftsViewModeSelector);

  return (
    <Container mb={20} mode={nftsViewMode}>
      {nfts.map(nft => (
        <Item
          key={nft.id}
          mode={nftsViewMode}
          id={nft.id}
          tokenId={nft.tokenId}
          contract={collectionId}
          account={account}
        />
      ))}
      {isLoading && (
        <SpinnerContainer>
          <SpinnerBackground>
            <Spinner size={14} />
          </SpinnerBackground>
        </SpinnerContainer>
      )}
    </Container>
  );
};

export default TokensList;

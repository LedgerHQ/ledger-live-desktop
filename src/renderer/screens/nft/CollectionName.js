// @flow
import React from "react";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import NFTCollectionContextMenu from "~/renderer/components/ContextMenu/NFTCollectionContextMenu";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import IconDots from "~/renderer/icons/Dots";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account } from "@ledgerhq/live-common/lib/types";

const Dots: ThemedComponent<{}> = styled.div`
  justify-content: flex-end;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  color: ${p => p.theme.colors.palette.text.shade20};
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade40};
  }
`;

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  column-gap: 10px;
`;

// TODO Make me pretty
const CollectionName = ({
  collection,
  fallback,
  account,
  showHideMenu,
}: {
  collection: { nfts: any[], contract: string, standard: string },
  fallback?: string,
  account?: Account,
  showHideMenu?: boolean,
}) => {
  const { nfts } = collection;
  const { status, metadata } = useNftMetadata(collection.contract, nfts[0]?.tokenId);
  const { tokenName } = metadata || {};
  const loading = status === "loading";

  return (
    <Skeleton width={80} minHeight={24} barHeight={10} show={loading}>
      <Container>
        {tokenName || fallback || "-"}
        {account && showHideMenu && (
          <NFTCollectionContextMenu
            collectionName={tokenName || fallback || "-"}
            collectionAddress={collection.contract}
            account={account}
            leftClick={true}
          >
            <Dots>
              <IconDots size={20} />
            </Dots>
          </NFTCollectionContextMenu>
        )}
      </Container>
    </Skeleton>
  );
};

export default CollectionName;

// @flow
import React, { memo } from "react";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft";
import NFTCollectionContextMenu from "~/renderer/components/ContextMenu/NFTCollectionContextMenu";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import IconDots from "~/renderer/icons/Dots";
import styled from "styled-components";

import type { ProtoNFT } from "@ledgerhq/live-common/lib/types";

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
  nft,
  fallback,
  account,
  showHideMenu,
}: {
  nft: ProtoNFT,
  fallback?: string,
  account?: Account,
  showHideMenu?: boolean,
}) => {
  const { status, metadata } = useNftMetadata(nft.contract, nft.tokenId, nft.currencyId);
  const { tokenName } = metadata || {};
  const loading = status === "loading";

  return (
    <Skeleton width={80} minHeight={24} barHeight={10} show={loading}>
      <Container>
        {tokenName || fallback || "-"}
        {account && showHideMenu && (
          <NFTCollectionContextMenu
            collectionName={tokenName || fallback || "-"}
            collectionAddress={nft.contract}
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

// $FlowFixMe
export default memo(CollectionName);

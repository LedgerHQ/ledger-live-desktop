// @flow
import React from "react";
import { useNFTMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import Skeleton from "~/renderer/screens/nft/Skeleton";

// TODO Make me pretty
const CollectionName = ({
  collection,
}: {
  collection: { nfts: any[], contract: string, standard: string },
}) => {
  const { nfts } = collection;
  const { metadata } = useNFTMetadata(collection.contract, nfts[0]?.tokenId);
  const { tokenName } = metadata || {};

  return (
    <Skeleton width={80} height={24} barHeight={10} show={!tokenName}>
      {tokenName}
    </Skeleton>
  );
};

export default CollectionName;

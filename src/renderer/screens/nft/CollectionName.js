// @flow
import React from "react";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import Skeleton from "~/renderer/screens/nft/Skeleton";

// TODO Make me pretty
const CollectionName = ({
  collection,
  fallback,
}: {
  collection: { nfts: any[], contract: string, standard: string },
  fallback?: string,
}) => {
  const { nfts } = collection;
  const { status, metadata } = useNftMetadata(collection.contract, nfts[0]?.tokenId);
  const { tokenName } = metadata || {};
  const loading = status === "loading";

  return (
    <Skeleton width={80} minHeight={24} barHeight={10} show={loading}>
      {tokenName || fallback || "-"}
    </Skeleton>
  );
};

export default CollectionName;

// @flow
import React, { memo } from "react";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft";
import Skeleton from "~/renderer/screens/nft/Skeleton";

import type { ProtoNFT } from "@ledgerhq/live-common/lib/types";

// TODO Make me pretty
const CollectionName = ({ nft, fallback }: { nft: ProtoNFT, fallback?: string }) => {
  const { status, metadata } = useNftMetadata(nft.contract, nft.tokenId, nft.currencyId);
  const { tokenName } = metadata || {};
  const loading = status === "loading";

  return (
    <Skeleton width={80} minHeight={24} barHeight={10} show={loading}>
      {tokenName || fallback || "-"}
    </Skeleton>
  );
};

// $FlowFixMe
export default memo(CollectionName);

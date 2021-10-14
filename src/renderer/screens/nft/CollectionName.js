// @flow
import { useNFTMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";

// TODO Make me pretty
const CollectionName = ({
  collection,
}: {
  collection: { nfts: any[], contract: string, standard: string },
}) => {
  const { nfts } = collection;
  const { metadata } = useNFTMetadata(collection.contract, nfts[0]?.tokenId);
  const { tokenName } = metadata || {};

  return tokenName;
};

export default CollectionName;

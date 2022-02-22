// @flow

import React, { useMemo, memo } from "react";
import styled from "styled-components";
import {
  useNftCollectionMetadata,
  useNftMetadata,
} from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, NFTWithMetadata } from "@ledgerhq/live-common/lib/types";
import NFTCollectionContextMenu from "~/renderer/components/ContextMenu/NFTCollectionContextMenu";
import Image from "~/renderer/screens/nft/Image";
import Skeleton from "~/renderer/screens/nft/Skeleton";

const Container: ThemedComponent<{}> = styled(Box)`
  &.disabled {
    pointer-events: none;
  }

  &:not(:nth-child(2)) {
    border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
  }
  cursor: pointer;
  &:hover {
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`;

type Props = {
  nfts: NFTWithMetadata[],
  contract: string,
  account: Account,
  onClick: string => void,
  account: Account,
};

const Row = ({ nfts, contract, account, onClick }: Props) => {
  const [nft] = nfts;
  const { status: collectionStatus, metadata: collectionMetadata } = useNftCollectionMetadata(
    contract,
    account.currency.id,
  );
  const { status: nftStatus, metadata: nftMetadata } = useNftMetadata(
    contract,
    nft.tokenId,
    account.currency.id,
  );
  const { tokenName } = collectionMetadata || {};
  const loading = useMemo(() => nftStatus === "loading" || collectionStatus === "loading", [
    collectionStatus,
    nftStatus,
  ]);

  return (
    <NFTCollectionContextMenu
      collectionName={tokenName}
      collectionAddress={contract}
      account={account}
    >
      <Container
        className={loading || process.env.ALWAYS_SHOW_SKELETONS ? "disabled" : ""}
        justifyContent="center"
        horizontal
        px={4}
        py={3}
        onClick={onClick}
      >
        <Skeleton width={32} minHeight={32} show={loading}>
          <Image metadata={nftMetadata} tokenId={nft?.tokenId} />
        </Skeleton>
        <Box ml={3} flex={1}>
          <Skeleton width={136} minHeight={24} barHeight={10} show={loading}>
            <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
              {tokenName || contract}
            </Text>
          </Skeleton>
        </Box>
        <Skeleton width={42} minHeight={24} barHeight={10} show={loading}>
          <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4} textAlign="right">
            {nfts?.length ?? 0}
          </Text>
        </Skeleton>
      </Container>
    </NFTCollectionContextMenu>
  );
};

export default memo<Props>(Row);

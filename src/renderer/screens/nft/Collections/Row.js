// @flow

import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { NFTWithMetadata } from "@ledgerhq/live-common/lib/types";
import Image from "~/renderer/screens/nft/Image";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import { useNFTMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";

const Container: ThemedComponent<{}> = styled(Box)`
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
  onClick: string => void,
};

const Row = ({ nfts, contract, onClick }: Props) => {
  const { status, metadata } = useNFTMetadata(contract, nfts[0].tokenId);
  const { tokenName } = metadata || {};

  return (
    <Container alignItems="center" horizontal px={4} py={3} onClick={onClick}>
      {status === "loaded" ? (
        <>
          <Image nft={metadata} />
          <Text
            ml={2}
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            fontSize={4}
            style={{ flexGrow: 1 }}
          >
            {tokenName}
          </Text>
          <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
            {nfts.length}
          </Text>
        </>
      ) : (
        <>
          <Skeleton width={32} height={32} />
          <Box ml={2} style={{ flexGrow: 1 }}>
            <Skeleton width={120} height={10} />
          </Box>
          <Box ml={10}>
            <Skeleton width={120} height={10} />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Row;

// @flow

import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { NFTWithMetadata } from "@ledgerhq/live-common/lib/types";
import Image from "~/renderer/screens/nft/Image";

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
  tokenName: string,
  nfts: NFTWithMetadata[],
  contract: string,
  onClick: string => void,
};

const Row = ({ tokenName, nfts, contract, onClick }: Props) => {
  return (
    <Container alignItems="center" horizontal px={4} py={3} onClick={onClick}>
      <Image nft={nfts[0]} />
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
    </Container>
  );
};

export default Row;

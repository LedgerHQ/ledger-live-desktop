// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Image from "~/renderer/screens/nft/Image";
import IconDots from "~/renderer/icons/Dots";
import { NFTWithMetadata } from "@ledgerhq/live-common/lib/types";

const Wrapper: ThemedComponent<{}> = styled(Card)`
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color ease-in-out 200ms;

  :hover {
    border-color: ${p => p.theme.colors.palette.text.shade20};
  }
  :active {
    border-color: ${p => p.theme.colors.palette.text.shade20};
    background: ${p => p.theme.colors.palette.action.hover};
  }
`;
const Dots: ThemedComponent<{}> = styled.div`
  justify-content: flex-end;
  cursor: pointer;
  padding: 5px;
  color: ${p => p.theme.colors.palette.text.shade40};
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade60};
  }
`;

type Props = {
  nft: NFTWithMetadata,
  mode: "grid" | "list",
};

const Row = ({ nft, mode }: Props) => {
  const { id, nftName, tokenId } = nft;

  const isGrid = mode === "grid";
  const onItemClick = useCallback(() => alert("item click"), []);
  const onDotsClick = useCallback(event => {
    event.stopPropagation();
    alert("dots click");
  }, []);

  return (
    <Wrapper
      px={3}
      py={isGrid ? 3 : 2}
      key={id}
      horizontal={!isGrid}
      alignItems={!isGrid ? "center" : undefined}
      onClick={onItemClick}
    >
      <Image nft={nft} size={40} full={isGrid} />
      <Box ml={2} flex={1} mt={isGrid ? 2 : 0}>
        <Text ff="Inter|Medium" color="palette.text.shade100" fontSize={isGrid ? 4 : 3}>
          {nftName}
        </Text>
        <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={isGrid ? 3 : 2}>
          <Trans
            i18nKey="NFT.gallery.tokensList.item.tokenId"
            values={{ tokenId: centerEllipsis(tokenId) }}
          />
        </Text>
      </Box>
      {!isGrid ? (
        <Dots onClick={onDotsClick}>
          <IconDots size={16} />
        </Dots>
      ) : null}
    </Wrapper>
  );
};

export default Row;

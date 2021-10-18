// @flow

import React, { useMemo, useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Image from "~/renderer/screens/nft/Image";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import IconDots from "~/renderer/icons/Dots";
import { useNFTMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";

const Wrapper: ThemedComponent<{}> = styled(Card)`
  &.disabled {
    pointer-events: none;
  }

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
  color: ${p => p.theme.colors.palette.text.shade20};
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade40};
  }
`;

type Props = {
  contract: string,
  tokenId: string,
  mode: "grid" | "list",
};

const Row = ({ contract, tokenId, mode }: Props) => {
  const { status, metadata } = useNFTMetadata(contract, tokenId);
  const { nftName } = metadata || {};

  const show = useMemo(() => status !== "loaded", [status]);
  const isGrid = mode === "grid";
  const onItemClick = useCallback(() => alert("item click"), []);
  const onDotsClick = useCallback(
    event => {
      event.stopPropagation();
      if (!show) return;
      alert("dots click");
    },
    [show],
  );

  return (
    <Wrapper
      px={3}
      py={isGrid ? 3 : 2}
      className={show || process.env.ALWAYS_SHOW_SKELETONS ? "disabled" : ""}
      horizontal={!isGrid}
      alignItems={!isGrid ? "center" : undefined}
      onClick={onItemClick}
    >
      <Skeleton width={40} height={40} full={isGrid} show={show}>
        <Image nft={metadata} size={40} full={isGrid} />
      </Skeleton>
      <Box ml={isGrid ? 0 : 3} flex={1} mt={isGrid ? 2 : 0}>
        <Skeleton width={isGrid ? 175 : 142} height={10} show={show}>
          <Text ff="Inter|Medium" color="palette.text.shade100" fontSize={isGrid ? 4 : 3}>
            {nftName}
          </Text>
        </Skeleton>
        <Skeleton width={150} height={6} mt={2} show={show}>
          <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={isGrid ? 3 : 2}>
            <Trans
              i18nKey="NFT.gallery.tokensList.item.tokenId"
              values={{ tokenId: centerEllipsis(tokenId) }}
            />
          </Text>
        </Skeleton>
      </Box>
      {!isGrid ? (
        <Dots onClick={onDotsClick}>
          <IconDots size={20} />
        </Dots>
      ) : null}
    </Wrapper>
  );
};

export default Row;

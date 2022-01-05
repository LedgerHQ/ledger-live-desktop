// @flow

import React, { useMemo, useCallback, memo } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { getNFTById } from "~/renderer/reducers/accounts";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Image from "~/renderer/screens/nft/Image";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import IconDots from "~/renderer/icons/Dots";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import NFTContextMenu from "~/renderer/components/ContextMenu/NFTContextMenu";
import { NFTViewerDrawer } from "~/renderer/drawers/NFTViewerDrawer";
import { setDrawer } from "~/renderer/drawers/Provider";

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
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  color: ${p => p.theme.colors.palette.text.shade20};
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade40};
  }
`;

const TitleContainer: ThemedComponent<{}> = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

type Props = {
  account: Account,
  contract: string,
  tokenId: string,
  id: string,
  mode: "grid" | "list",
  withContextMenu?: boolean,
};

const NftCard = ({ contract, tokenId, id, mode, account, withContextMenu = false }: Props) => {
  const { status, metadata } = useNftMetadata(contract, tokenId);
  const nft = useSelector(state => getNFTById(state, { nftId: id }));
  const { nftName } = metadata || {};
  const show = useMemo(() => status === "loading", [status]);
  const isGrid = mode === "grid";

  const onItemClick = useCallback(() => {
    setDrawer(NFTViewerDrawer, {
      account,
      nftId: id,
      isOpen: true,
    });
  }, [id, account]);

  const MaybeContext = ({ children }: any) =>
    withContextMenu ? (
      <NFTContextMenu key={id} contract={contract} tokenId={tokenId}>
        {children}
      </NFTContextMenu>
    ) : (
      <>{children}</>
    );

  return (
    <MaybeContext>
      <Wrapper
        px={3}
        py={isGrid ? 3 : 2}
        className={show || process.env.ALWAYS_SHOW_SKELETONS ? "disabled" : ""}
        horizontal={!isGrid}
        alignItems={!isGrid ? "center" : undefined}
        onClick={onItemClick}
      >
        <Skeleton width={40} minHeight={40} full={isGrid} show={show}>
          <Image nft={metadata} size={40} full={isGrid} />
        </Skeleton>
        <Box ml={isGrid ? 0 : 3} flex={1} mt={isGrid ? 2 : 0}>
          <Skeleton width={142} minHeight={24} barHeight={10} show={show}>
            <TitleContainer
              ff="Inter|Medium"
              color="palette.text.shade100"
              fontSize={isGrid ? 4 : 3}
            >
              {nftName || "-"}
            </TitleContainer>
          </Skeleton>
          <Skeleton width={180} minHeight={24} barHeight={6} show={show}>
            <Box horizontal justifyContent="space-between">
              <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={isGrid ? 3 : 2}>
                <Trans
                  i18nKey="NFT.gallery.tokensList.item.tokenId"
                  values={{ tokenId: centerEllipsis(tokenId) }}
                />
              </Text>
              {nft.collection.standard === "ERC1155" && isGrid && (
                <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3}>
                  {`x${nft.amount.toFixed()}`}
                </Text>
              )}
            </Box>
          </Skeleton>
        </Box>
        {!isGrid ? (
          <>
            {nft.collection.standard === "ERC1155" && (
              <Text ff="Inter|Medium" color="palette.text.shade50" fontSize={3} mr={15}>
                {`x${nft.amount.toFixed()}`}
              </Text>
            )}
            <NFTContextMenu key={id} contract={contract} tokenId={tokenId} leftClick={true}>
              <Dots>
                <IconDots size={20} />
              </Dots>
            </NFTContextMenu>
          </>
        ) : null}
      </Wrapper>
    </MaybeContext>
  );
};

// $FlowFixMe
export default memo(NftCard);

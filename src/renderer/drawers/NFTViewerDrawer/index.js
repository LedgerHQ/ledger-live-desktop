// @flow

import React, { useMemo, useCallback, useState, memo } from "react";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import IconSend from "~/renderer/icons/Send";
import ZoomInIcon from "~/renderer/icons/ZoomIn";

import type { Account } from "@ledgerhq/live-common/lib/types";

import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getNFTById } from "~/renderer/reducers/accounts";
import { NFTProperties } from "./NFTProperties";
import { CopiableField } from "./CopiableField";
import NftPanAndZoom from "./NftPanAndZoom";
import ExternalViewerButton from "./ExternalViewerButton";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import Image from "~/renderer/screens/nft/Image";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { space, layout, position } from "styled-system";
import { openModal } from "~/renderer/actions/modals";
import { setDrawer } from "~/renderer/drawers/Provider";
import { SplitAddress } from "~/renderer/components/OperationsList/AddressCell";

const NFTViewerDrawerContainer = styled.div`
  flex: 1;
  overflow-y: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const NFTViewerDrawerContent = styled.div`
  padding: 0px 40px;
  padding-top: 53px;
  display: flex;
  flex-direction: column;
`;

const Pre = styled.span`
  white-space: pre-line;
  display: block;
  unicode-bidi: embed;
  line-break: anywhere;
  line-height: 15px;
`;

const StickyWrapper = styled.div`
  background: ${({ theme, transparent }) =>
    transparent
      ? "transparent"
      : `linear-gradient(${theme.colors.palette.background.paper} 0%, ${theme.colors.palette.background.paper}90 75%, transparent 100%);`};
  position: sticky;
  ${position};
  ${layout};
  ${space}
  z-index: 1;
`;

const NFTActions = styled.div`
  display: flex;
  flex-direction: row;
  margin: 12px 0px;
  justify-content: center;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.palette.text.shade10};
  margin: 24px 0px;
`;

const NFTAttributes = styled.div`
  margin: 24px 0px;
  display: flex;
  flex-direction: column;
`;

const NFTImageContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const NFTImageOverlay = styled.div`
  opacity: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  &:hover {
    opacity: 1;
  }
`;

const HashContainer = styled.div`
  word-break: break-all;
  user-select: text;
  width: 100%;
  min-width: 100px;
  user-select: none;
`;

const NFTAttribute = memo(
  ({
    title,
    value,
    skeleton,
    separatorBottom,
    separatorTop,
  }: {
    title: string,
    value: string,
    skeleton?: boolean,
    separatorBottom?: boolean,
    separatorTop?: boolean,
  }) => {
    if (!skeleton && !value) return null;

    return (
      <>
        {separatorTop ? <Separator /> : null}
        <Text
          mb={1}
          lineHeight="15.73px"
          fontSize={4}
          color="palette.text.shade60"
          ff="Inter|SemiBold"
        >
          {title}
        </Text>
        <Skeleton show={skeleton} width={120} minHeight={24} barHeight={10}>
          <Text lineHeight="15.73px" fontSize={4} color="palette.text.shade100" ff="Inter|Regular">
            <Pre>{value}</Pre>
          </Text>
        </Skeleton>
        {separatorBottom ? <Separator /> : null}
      </>
    );
  },
);
NFTAttribute.displayName = "NFTAttribute";

type NFTViewerDrawerProps = {
  account: Account,
  nftId: string,
  isOpen: boolean,
  height?: number,
  onRequestClose: () => void,
};

const NFTViewerDrawer = ({ account, nftId, height }: NFTViewerDrawerProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const nft = useSelector(state => getNFTById(state, { nftId }));
  const { status, metadata } = useNftMetadata(nft.contract, nft.tokenId, nft.currencyId);
  const show = useMemo(() => status === "loading", [status]);
  const name = metadata?.nftName || nft.tokenId;

  const onNFTSend = useCallback(() => {
    setDrawer();
    dispatch(openModal("MODAL_SEND", { account, isNFTSend: true, nftId }));
  }, [dispatch, nftId, account]);

  const [isPanAndZoomOpen, setPanAndZoomOpen] = useState(false);

  const openNftPanAndZoom = useCallback(() => {
    setPanAndZoomOpen(true);
  }, [setPanAndZoomOpen]);

  const closeNftPanAndZoom = useCallback(() => {
    setPanAndZoomOpen(false);
  }, [setPanAndZoomOpen]);

  return (
    <Box height={height}>
      {isPanAndZoomOpen && <NftPanAndZoom nft={metadata} onClose={closeNftPanAndZoom} />}
      <NFTViewerDrawerContainer>
        <NFTViewerDrawerContent>
          <StickyWrapper top={0} pb={3} pt="24px">
            <Text
              ff="Inter|SemiBold"
              fontSize={5}
              lineHeight="18px"
              color="palette.text.shade50"
              pb={2}
            >
              <Skeleton show={show} width={100} barHeight={10} minHeight={24}>
                {metadata?.tokenName || "-"}
              </Skeleton>
            </Text>
            <Text
              ff="Inter|SemiBold"
              fontSize={7}
              lineHeight="29px"
              color="palette.text.shade100"
              style={{
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                display: "-webkit-box",
              }}
              uppercase
            >
              {name}
            </Text>
          </StickyWrapper>
          <Skeleton show={show} width={393}>
            <NFTImageContainer onClick={openNftPanAndZoom}>
              <Image nft={metadata} full square={false} maxHeight={700} />
              <NFTImageOverlay>
                <ZoomInIcon color="white" />
              </NFTImageOverlay>
            </NFTImageContainer>
          </Skeleton>
          <NFTActions>
            <Button
              style={{ flex: 1, justifyContent: "center" }}
              mr={4}
              primary
              onClick={onNFTSend}
              center
            >
              <IconSend size={12} />
              <Text ml={1} fontSize={3} lineHeight="18px">
                {t("NFT.viewer.actions.send")}
              </Text>
            </Button>

            <ExternalViewerButton
              links={metadata?.links}
              contract={nft.contract}
              tokenId={nft.tokenId}
              currencyId={nft.currencyId}
            />
          </NFTActions>
          <NFTAttributes>
            <NFTProperties nft={nft} metadata={metadata} status={status} />
            <NFTAttribute
              skeleton={show}
              title={t("NFT.viewer.attributes.description")}
              value={metadata?.description}
              separatorBottom
            />
            <Text
              mb="6px"
              lineHeight="15.73px"
              fontSize={4}
              color="palette.text.shade60"
              fontWeight="600"
            >
              {t("NFT.viewer.attributes.tokenAddress")}
            </Text>
            <Text lineHeight="15.73px" fontSize={4} color="palette.text.shade100" fontWeight="600">
              <CopiableField value={nft.contract}>
                <HashContainer>
                  <SplitAddress value={nft.contract} ff="Inter|Regular" />
                </HashContainer>
              </CopiableField>
            </Text>
            <Separator />
            <Text
              mb={1}
              lineHeight="15.73px"
              fontSize={4}
              color="palette.text.shade60"
              fontWeight="600"
            >
              {t("NFT.viewer.attributes.tokenId")}
            </Text>
            <Text lineHeight="15.73px" fontSize={4} color="palette.text.shade100">
              <CopiableField value={nft.tokenId}>
                {// only needed for very long tokenIds but works with any length > 4
                nft.tokenId?.length >= 4 ? (
                  <HashContainer>
                    <SplitAddress value={nft.tokenId} />
                  </HashContainer>
                ) : (
                  nft.tokenId
                )}
              </CopiableField>
            </Text>
            {nft.standard === "ERC1155" ? (
              <React.Fragment>
                <NFTAttribute
                  separatorTop
                  skeleton={show}
                  title={t("NFT.viewer.attributes.quantity")}
                  value={nft.amount.toString()}
                />
              </React.Fragment>
            ) : null}
          </NFTAttributes>
        </NFTViewerDrawerContent>
      </NFTViewerDrawerContainer>
    </Box>
  );
};

export default memo<NFTViewerDrawerProps>(NFTViewerDrawer);

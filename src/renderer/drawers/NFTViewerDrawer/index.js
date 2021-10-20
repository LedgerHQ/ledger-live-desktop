// @flow

import React, { useMemo, useCallback } from "react";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import IconSend from "~/renderer/icons/Send";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getNFTById } from "~/renderer/reducers/accounts";
import { NFTProperties } from "./NFTProperties";
import { CopiableField } from "./CopiableField";
import { ExternalViewerButton } from "./ExternalViewerButton";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import Image from "~/renderer/screens/nft/Image";
import { centerEllipsis } from "~/renderer/styles/helpers";
import { useNFTMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { space, layout, position } from "styled-system";
const NFTViewerDrawerContainer = styled.div`
  flex: 1;
  overflow-y: hidden;
`;

const Pre = styled.span`
  white-space: pre-line;
  display: block;
  unicode-bidi: embed;
  line-break: anywhere;
  line-height: 15px;
`;

const StickyWrapper = styled.div`
  background-color: ${({ theme, transparent }) =>
    transparent ? "transparent" : theme.colors.palette.background.paper};
  position: sticky;
  ${position};
  ${layout};
  ${space}
  z-index: 1;
`;

const NFTViewerDrawerContent = styled.div`
  padding: 0px 40px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  height: 100%;
`;

const NFTActions = styled.div`
  display: flex;
  flex-direction: row;
  margin: 12px 0px;
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

function NFTAttribute({
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
}) {
  if (!skeleton && !value) return null;

  return (
    <React.Fragment>
      {separatorTop ? <Separator /> : null}
      <Text
        mb={1}
        lineHeight="15.73px"
        fontSize={4}
        color="palette.text.shade60"
        ff="Inter|Regular"
      >
        {title}
      </Text>
      <Skeleton show={skeleton} width={120} minHeight={24} barHeight={10}>
        <Text lineHeight="15.73px" fontSize={4} color="palette.text.shade100" ff="Inter|SemiBold">
          <Pre>{value}</Pre>
        </Text>
      </Skeleton>
      {separatorBottom ? <Separator /> : null}
    </React.Fragment>
  );
}

type NFTViewerDrawerProps = {
  nftId: string,
  isOpen: boolean,
  height?: number,
  onRequestClose: () => void,
};

export function NFTViewerDrawer({ nftId, isOpen, onRequestClose, height }: NFTViewerDrawerProps) {
  const { t } = useTranslation();

  const nft = useSelector(state => getNFTById(state, { nftId }));
  const { status, metadata } = useNFTMetadata(nft.collection.contract, nft.tokenId);
  const show = useMemo(() => status !== "loaded", [status]);
  const name = centerEllipsis(metadata?.nftName || nft.tokenId, 26);

  const onNFTSend = useCallback(() => {
    alert("SEND");
  }, []);

  return (
    <Box height={height}>
      <NFTViewerDrawerContainer>
        <NFTViewerDrawerContent>
          <StickyWrapper top={0} pb={3}>
            <Text
              ff="Inter|SemiBold"
              fontSize={5}
              lineHeight="18px"
              color="palette.text.shade50"
              uppercase
              pb={2}
            >
              <Skeleton show={show} width={100} barHeight={10} minHeight={24}>
                {metadata?.tokenName}
              </Skeleton>
            </Text>
            <Text
              ff="Inter|SemiBold"
              fontSize={7}
              lineHeight="29px"
              color="palette.text.shade100"
              uppercase
              pb={5}
            >
              {name}
            </Text>
          </StickyWrapper>
          <Skeleton show={show} width={393} minHeight={393}>
            <Image nft={metadata} size={393} />
          </Skeleton>
          <StickyWrapper top={50}>
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

              <ExternalViewerButton nft={nft} />
            </NFTActions>
          </StickyWrapper>
          <NFTAttributes>
            <NFTProperties nft={nft} metadata={metadata} />
            <NFTAttribute
              skeleton={show}
              title={t("NFT.viewer.attributes.about")}
              value={metadata?.description}
              separatorBottom
            />
            <Text
              mb="6px"
              lineHeight="15.73px"
              fontSize={4}
              color="palette.text.shade60"
              fontWeight="400"
            >
              {t("NFT.viewer.attributes.contract")}
            </Text>
            <Text lineHeight="15.73px" fontSize={4} color="palette.text.shade100" fontWeight="600">
              <CopiableField value={nft.collection.contract} />
            </Text>
            <Separator />
            <Text
              mb={1}
              lineHeight="15.73px"
              fontSize={4}
              color="palette.text.shade60"
              fontWeight="400"
            >
              {t("NFT.viewer.attributes.tokenId")}
            </Text>
            <Text lineHeight="15.73px" fontSize={4} color="palette.text.shade100" fontWeight="600">
              <CopiableField value={nft.tokenId} />
            </Text>
            {nft.collection.standard === "ERC1155" ? (
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
}

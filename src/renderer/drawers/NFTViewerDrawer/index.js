// @flow

import React, { useEffect, useCallback } from "react";
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
import { useNFTMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";

const NFTViewerDrawerContainer = styled.div`
  flex: 1;
  overflow-y: hidden;
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

const NFTImage = styled.div.attrs(({ src }) => ({
  style: {
    backgroundImage: `url("${src}")`,
  },
}))`
  width: 100%;
  height: 420px;
  pointer-events: none;
  outline: none;
  user-select: none;
  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1));
  border-radius: 8px;
  background-size: cover;
`;

const NFTActions = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 0px;
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

function NFTAttribute({ title, value }: { title: string, value: string }) {
  return (
    <React.Fragment>
      <Text
        mb="6px"
        lineHeight="15.73px"
        fontSize="13px"
        color="palette.text.shade60"
        fontWeight="400"
      >
        {title}
      </Text>
      <Text lineHeight="15.73px" fontSize="13px" color="palette.text.shade100" fontWeight="600">
        {value}
      </Text>
    </React.Fragment>
  );
}

type NFTViewerDrawerProps = {
  nftId: string,
  isOpen: boolean,
  onRequestClose: () => void,
};

export function NFTViewerDrawer({ nftId, isOpen, onRequestClose }: NFTViewerDrawerProps) {
  const { t } = useTranslation();

  const nft = useSelector(state => getNFTById(state, { nftId }));
  const { status, metadata } = useNFTMetadata(nft.contract, nft.tokenId);

  const onNFTSend = useCallback(() => {}, [nftId]);

  useEffect(() => {
    console.log({ nft, metadata });
  }, [metadata, nft]);

  return (
    <Box>
      <NFTViewerDrawerContainer>
        <NFTViewerDrawerContent>
          <Text
            fontSize="15px"
            fontWeight="600"
            lineHeight="18px"
            color="palette.text.shade50"
            style={{
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {nft.collection.tokenName}
          </Text>
          <Text
            fontSize="24px"
            fontWeight="600"
            lineHeight="29px"
            color="palette.text.shade100"
            style={{
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            {status === "loaded" ? metadata.nftName : nft.tokenId}
          </Text>
          {status === "loaded" && metadata.picture ? <NFTImage src={metadata.picture} /> : null}
          <NFTActions>
            <Button style={{ flex: 1 }} mr={5} primary onClick={onNFTSend} center>
              <IconSend size={12} />
              <Text ml={1} fontSize={3} lineHeight="18px">
                {t("nft.viewer.actions.send")}
              </Text>
            </Button>
            <ExternalViewerButton nft={nft} />
          </NFTActions>
          <NFTAttributes>
            {status === "loaded" ? <NFTProperties nft={nft} metadata={metadata} /> : null}
            <Separator />
            {status === "loaded" ? (
              <NFTAttribute title={t("nft.viewer.attributes.about")} value={metadata.description} />
            ) : null}
            <Separator />
            <Text
              mb="6px"
              lineHeight="15.73px"
              fontSize={4}
              color="palette.text.shade60"
              fontWeight="400"
            >
              {t("nft.viewer.attributes.contract")}
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
              {t("nft.viewer.attributes.tokenId")}
            </Text>
            <Text lineHeight="15.73px" fontSize={4} color="palette.text.shade100" fontWeight="600">
              <CopiableField value={nft.tokenId} />
            </Text>
            {nft.collection.standard === "ERC1155" ? (
              <React.Fragment>
                <Separator />
                <NFTAttribute
                  title={t("nft.viewer.attributes.quantity")}
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

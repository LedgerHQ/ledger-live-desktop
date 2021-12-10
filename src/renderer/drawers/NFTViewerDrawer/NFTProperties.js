// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import { useTranslation } from "react-i18next";

import type { NFT, NFTMetadata } from "@ledgerhq/live-common/lib/types";

const NFTProperty = styled.div`
  display: inline-flex;
  flex-direction: column;
  padding: 8px 12px;
  background: rgba(100, 144, 241, 0.1);
  border-radius: 4px;
`;

const NFTPropertiesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 12px;
  column-gap: 16px;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.palette.text.shade10};
  margin: 24px 0px;
`;

type NFTPropertiesProps = {
  nft: NFT,
  metadata: NFTMetadata,
  status: string,
};

export function NFTProperties({ nft, metadata }: NFTPropertiesProps) {
  const { t } = useTranslation();
  const showSkeleton = status === "loading";
  if (!metadata?.properties?.length) return null;

  return (
    <React.Fragment>
      <Text
        mb="12px"
        lineHeight="17px"
        fontSize="14px"
        color="palette.text.shade50"
        ff="Inter|Regular"
      >
        {t("NFT.viewer.attributes.properties")}
      </Text>
      <NFTPropertiesContainer>
        {metadata ? (
          metadata.properties.map(({ key, value }) => (
            <NFTProperty key={key + value}>
              <Text
                mb="2px"
                lineHeight="12.1px"
                fontSize={2}
                color="rgba(100, 144, 241, 0.5);"
                ff="Inter|SemiBold"
                uppercase
              >
                {key}
              </Text>
              <Text mb="2px" lineHeight="16.94px" fontSize={4} color="#6490F1" ff="Inter|SemiBold">
                {value}
              </Text>
            </NFTProperty>
          ))
        ) : (
          <>
            <Skeleton width={66} barHeight={50} show={showSkeleton} />
            <Skeleton width={66} barHeight={50} show={showSkeleton} />
            <Skeleton width={66} barHeight={50} show={showSkeleton} />
            <Skeleton width={66} barHeight={50} show={showSkeleton} />
            <Skeleton width={66} barHeight={50} show={showSkeleton} />
            <Skeleton width={66} barHeight={50} show={showSkeleton} />
            <Skeleton width={66} barHeight={50} show={showSkeleton} />
          </>
        )}
      </NFTPropertiesContainer>
      <Separator />
    </React.Fragment>
  );
}

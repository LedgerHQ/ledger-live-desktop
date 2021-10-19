// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
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

type NFTPropertiesProps = {
  nft: NFT,
  metadata: NFTMetadata,
};

export function NFTProperties({ nft, metadata }: NFTPropertiesProps) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Text
        mb="12px"
        lineHeight="17px"
        fontSize="14px"
        color="palette.text.shade50"
        fontWeight={400}
      >
        {t("nft.viewer.attributes.properties")}
      </Text>
      <NFTPropertiesContainer>
        {metadata.properties.map(property => (
          <NFTProperty key={property.key}>
            <Text
              mb="2px"
              lineHeight="12.1px"
              fontSize="10px"
              color="rgba(100, 144, 241, 0.5);"
              fontWeight={600}
              uppercase
            >
              {property.key}
            </Text>
            <Text mb="2px" lineHeight="16.94px" fontSize="14px" color="#6490F1" fontWeight={600}>
              {property.value}
            </Text>
          </NFTProperty>
        ))}
      </NFTPropertiesContainer>
    </React.Fragment>
  );
}

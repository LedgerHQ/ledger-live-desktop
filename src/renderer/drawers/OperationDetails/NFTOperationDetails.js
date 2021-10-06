// @flow

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  OpDetailsSection,
  OpDetailsTitle,
  GradientHover,
  OpDetailsData,
  TextEllipsis,
  HashContainer,
} from "~/renderer/drawers/OperationDetails/styledComponents";
import { SplitAddress } from "~/renderer/components/OperationsList/AddressCell";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import Image from "~/renderer/screens/nft/Image";
import Box from "~/renderer/components/Box";
import { useNfts } from "@ledgerhq/live-common/lib/nft";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";

const NFTOperationDetails = ({ operation }: { operation: Operation }) => {
  const { t } = useTranslation();
  const operations = useMemo(() => [operation], [operation]);
  const nfts = useNfts(operations);
  const nft = nfts[0];

  return !nft ? null : (
    <>
      <OpDetailsSection>
        <OpDetailsTitle>{t("operationDetails.nft.name")}</OpDetailsTitle>
        <OpDetailsData>
          <Box horizontal alignItems="center">
            <Image nft={nft} />
            <Box ml={2}>
              <TextEllipsis>{nft.nftName}</TextEllipsis>
            </Box>
          </Box>
          <GradientHover>
            <CopyWithFeedback text={nft.nftName} />
          </GradientHover>
        </OpDetailsData>
      </OpDetailsSection>
      <OpDetailsSection>
        <OpDetailsTitle>{t("operationDetails.nft.contract")}</OpDetailsTitle>
        <OpDetailsData>
          <HashContainer>
            <SplitAddress value={nft.collection.contract} />
          </HashContainer>
          <GradientHover>
            <CopyWithFeedback text={nft.collection.contract} />
          </GradientHover>
        </OpDetailsData>
      </OpDetailsSection>
      <OpDetailsSection>
        <OpDetailsTitle>{t("operationDetails.nft.id")}</OpDetailsTitle>
        <OpDetailsData>
          <HashContainer>
            <SplitAddress value={nft.tokenId} />
          </HashContainer>
          <GradientHover>
            <CopyWithFeedback text={nft.tokenId} />
          </GradientHover>
        </OpDetailsData>
      </OpDetailsSection>
      {operation.value && (
        <OpDetailsSection>
          <OpDetailsTitle>{t("operationDetails.nft.amount")}</OpDetailsTitle>
          <OpDetailsData>
            <TextEllipsis>{operation.value.toString()}</TextEllipsis>
          </OpDetailsData>
        </OpDetailsSection>
      )}
    </>
  );
};

export default NFTOperationDetails;

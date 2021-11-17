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
import type { Operation } from "@ledgerhq/live-common/lib/types";
import Image from "~/renderer/screens/nft/Image";
import Box from "~/renderer/components/Box";
import { nftsFromOperations } from "@ledgerhq/live-common/lib/nft/helpers";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import { centerEllipsis } from "~/renderer/styles/helpers";

const NFTOperationDetails = ({ operation }: { operation: Operation }) => {
  const { t } = useTranslation();
  const operations = useMemo(() => [operation], [operation]);
  const nfts = nftsFromOperations(operations);
  const { status, metadata } = useNftMetadata(nfts[0]?.collection?.contract, nfts[0]?.tokenId);
  const show = useMemo(() => status === "loading", [status]);

  return nfts.length > 0 ? (
    <>
      <OpDetailsSection>
        <OpDetailsTitle>{t("operationDetails.nft.name")}</OpDetailsTitle>
        <OpDetailsData>
          <Box horizontal alignItems="center">
            <Skeleton width={24} minHeight={24} show={show}>
              <Image nft={metadata} size={24} />
            </Skeleton>
            <Box ml={2}>
              <Skeleton width={200} barHeight={10} minHeight={32} show={show}>
                <TextEllipsis>{metadata?.nftName || "-"}</TextEllipsis>
              </Skeleton>
            </Box>
          </Box>
          {!show ? (
            <GradientHover>
              <CopyWithFeedback text={metadata?.nftName} />
            </GradientHover>
          ) : null}
        </OpDetailsData>
      </OpDetailsSection>
      <OpDetailsSection>
        <OpDetailsTitle>{t("operationDetails.nft.contract")}</OpDetailsTitle>
        <OpDetailsData>
          <Skeleton width={80} barHeight={10} minHeight={24} show={show}>
            <HashContainer>{centerEllipsis(metadata?.contract, 33)}</HashContainer>
          </Skeleton>
          {!show ? (
            <GradientHover>
              <CopyWithFeedback text={metadata?.contract} />
            </GradientHover>
          ) : null}
        </OpDetailsData>
      </OpDetailsSection>
      <OpDetailsSection>
        <OpDetailsTitle>{t("operationDetails.nft.id")}</OpDetailsTitle>
        <OpDetailsData>
          <Skeleton width={80} minHeight={10} show={show}>
            <HashContainer>{centerEllipsis(metadata?.tokenId, 33)}</HashContainer>
          </Skeleton>
          {!show ? (
            <GradientHover>
              <CopyWithFeedback text={metadata?.tokenId} />
            </GradientHover>
          ) : null}
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
  ) : null;
};

export default NFTOperationDetails;

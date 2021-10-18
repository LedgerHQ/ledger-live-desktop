// @flow
import React, { useMemo } from "react";
import toPairs from "lodash/toPairs";
import { Trans } from "react-i18next";
import type { AccountLike, Operation } from "@ledgerhq/live-common/lib/types";
import { nftsFromOperations } from "@ledgerhq/live-common/lib/nft/helpers";
import { useNFTMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Box from "~/renderer/components/Box";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import Text from "~/renderer/components/Text";

import {
  OpDetailsTitle,
  OpDetailsData,
  OpDetailsSection,
} from "~/renderer/drawers/OperationDetails/styledComponents";
import Ellipsis from "~/renderer/components/Ellipsis";

type OperationDetailsExtraProps = {
  extra: { [key: string]: string },
  type: string,
  account: ?AccountLike,
};

const OperationDetailsExtra = ({ extra, type }: OperationDetailsExtraProps) => {
  const entries = toPairs(extra);
  // $FlowFixMe
  return (type === "REDEEM" || type === "SUPPLY"
    ? entries.filter(([key]) => !["compoundValue", "rate"].includes(key))
    : entries
  ).map(([key, value]) => (
    <OpDetailsSection key={key}>
      <OpDetailsTitle>
        <Trans i18nKey={`operationDetails.extra.${key}`} defaults={key} />
      </OpDetailsTitle>
      <OpDetailsData>
        <Ellipsis>{value}</Ellipsis>
      </OpDetailsData>
    </OpDetailsSection>
  ));
};

type Props = {
  operation: Operation,
};

const NFTAmountField = ({ operation }: Props) => {
  const operations = useMemo(() => [operation], [operation]);
  const nfts = nftsFromOperations(operations);
  const { status, metadata } = useNFTMetadata(nfts[0]?.collection.contract, nfts[0]?.tokenId);
  const show = useMemo(() => status !== "loaded", [status]);

  return (
    <Box flex={1}>
      <Skeleton show={show} width={120} height={10}>
        <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade100">
          {metadata?.nftName}
        </Text>
      </Skeleton>
      <Skeleton show={show} width={120} height={6}>
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade100">
          {centerEllipsis(metadata?.tokenId)}
        </Text>
      </Skeleton>
    </Box>
  );
};

const amountCellExtra = {
  NFT_OUT: NFTAmountField,
  NFT_IN: NFTAmountField,
};

export default {
  OperationDetailsExtra,
  amountCellExtra,
};

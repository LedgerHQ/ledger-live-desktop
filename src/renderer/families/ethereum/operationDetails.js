// @flow
import React, { useMemo } from "react";
import toPairs from "lodash/toPairs";
import { Trans } from "react-i18next";
import type { AccountLike, Operation } from "@ledgerhq/live-common/lib/types";
import { useNfts } from "@ledgerhq/live-common/lib/nft";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Box from "~/renderer/components/Box";
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
  const nfts = useNfts(operations);
  const nft = nfts[0];

  return nft ? (
    <Box flex={1}>
      <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade100">
        {nft.nftName}
      </Text>
      <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade100">
        {centerEllipsis(nft.tokenId)}
      </Text>
    </Box>
  ) : null;
};

const amountCellExtra = {
  NFT_OUT: NFTAmountField,
  NFT_IN: NFTAmountField,
};

export default {
  OperationDetailsExtra,
  amountCellExtra,
};

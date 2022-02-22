// @flow

import React, { useMemo, memo } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { getAllNFTs } from "~/renderer/reducers/accounts";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import Image from "~/renderer/screens/nft/Image";
import Skeleton from "~/renderer/screens/nft/Skeleton";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { centerEllipsis } from "~/renderer/styles/helpers";

type Props = {
  transaction: Transaction,
};

const Summary = ({ transaction }: Props) => {
  const allNfts = useSelector(getAllNFTs);
  const [tokenId] = transaction.tokenIds;
  const [quantity] = transaction.quantities;
  const contract = transaction.collection;
  const nft = allNfts.find(nft => nft.tokenId === tokenId && nft.contract === contract);
  const { status, metadata } = useNftMetadata(nft.contract, nft.tokenId, nft.currencyId);
  const { nftName } = metadata || {};
  const show = useMemo(() => status === "loading", [status]);

  return (
    <>
      <Box horizontal justifyContent="space-between" maxWi mb={2}>
        <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
          <Trans i18nKey="send.steps.details.nft" />
        </Text>
        <Box horizontal>
          <Box mr={3} alignItems="flex-end">
            <Skeleton width={42} minHeight={18} barHeight={6} show={show}>
              <Text ff="Inter|Medium" color="palette.text.shade100" fontSize={4}>
                {nftName || "-"}
              </Text>
            </Skeleton>
            <Skeleton width={42} minHeight={18} barHeight={6} show={show}>
              <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={3}>
                {"ID:"}
                {centerEllipsis(nft.tokenId)}
              </Text>
            </Skeleton>
          </Box>
          <Skeleton width={48} minHeight={48} show={show}>
            <Image metadata={metadata} tokenId={tokenId} size={48} />
          </Skeleton>
        </Box>
      </Box>
      {nft.standard === "ERC1155" ? (
        <Box horizontal justifyContent="space-between" mb={2}>
          <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
            <Trans i18nKey="send.steps.details.nftQuantity" />
          </Text>
          <Box>
            <Text ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
              {quantity.toFixed()}
            </Text>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default memo<Props>(Summary);

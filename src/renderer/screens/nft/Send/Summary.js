// @flow

import React, { useMemo } from "react";
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

const Summary = ({ transaction }: { transaction: Transaction }) => {
  const allNfts = useSelector(getAllNFTs);
  const nft = allNfts.find(nft => nft.tokenId === transaction?.tokenIds[0]);
  const { status, metadata } = useNftMetadata(nft.collection.contract, nft.tokenId);
  const { nftName } = metadata || {};
  const show = useMemo(() => status === "loading", [status]);

  return (
    <>
      <Box horizontal justifyContent="space-between" mb={2}>
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
            <Image nft={metadata} size={48} />
          </Skeleton>
        </Box>
      </Box>
      {nft.collection.standard === "ERC1155" ? (
        <Box horizontal justifyContent="space-between" mb={2}>
          <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
            <Trans i18nKey="send.steps.details.nftQuantity" />
          </Text>
          <Box>
            <Text ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
              {transaction.quantities[0].toString()}
            </Text>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default Summary;

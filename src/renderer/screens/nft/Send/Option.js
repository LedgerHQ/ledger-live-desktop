// @flow
import React, { useMemo } from "react";
import { BigNumber } from "bignumber.js";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { centerEllipsis } from "~/renderer/styles/helpers";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Image from "~/renderer/screens/nft/Image";
import Skeleton from "~/renderer/screens/nft/Skeleton";

type OptionProps = {
  data: {
    tokenId: string,
    amount: BigNumber,
    collection: { contract: string, standard: string },
  },
};

const Option = ({
  data: {
    tokenId,
    amount,
    collection: { contract, standard },
  },
}: OptionProps) => {
  const { status, metadata } = useNftMetadata(contract, tokenId);
  const show = useMemo(() => status === "loading", [status]);
  return (
    <Box horizontal>
      <Skeleton width={30} minHeight={30} show={show}>
        <Image nft={metadata} size={30} />
      </Skeleton>
      <Box horizontal alignItems="center" justifyContent="space-between" flex={1}>
        <Box ml={3}>
          <Skeleton width={142} minHeight={15} barHeight={8} show={show}>
            <Text ff="Inter|Medium" color="palette.text.shade100" fontSize={2}>
              {metadata?.nftName || "-"}
            </Text>
          </Skeleton>
          <Skeleton width={80} minHeight={15} barHeight={8} show={show}>
            <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={2}>
              {"ID:"}
              {centerEllipsis(metadata?.tokenId)}
            </Text>
          </Skeleton>
        </Box>
        {standard === "ERC1155" ? (
          <Text ff="Inter|Medium" fontSize={3}>
            {"x"}
            {amount.toFixed()}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
};

export default Option;

// @flow
import React, { memo } from "react";
import ContextMenuItem from "./ContextMenuItem";
import type { Account, ProtoNFT, NFTMetadata } from "@ledgerhq/live-common/lib/types";
import useNftLinks from "~/renderer/hooks/useNftLinks";

type Props = {
  account: Account,
  nft: ProtoNFT,
  metadata: NFTMetadata,
  leftClick?: boolean,
  children: any,
  onHideCollection?: () => void,
};

const NFTContextMenu = ({
  leftClick,
  children,
  account,
  nft,
  metadata,
  onHideCollection,
}: Props) => {
  const links = useNftLinks(account, nft, metadata, onHideCollection);

  return (
    <ContextMenuItem leftClick={leftClick} items={links}>
      {children}
    </ContextMenuItem>
  );
};

export default memo<Props>(NFTContextMenu);

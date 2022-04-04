// @flow
import React, { useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import ContextMenuItem from "./ContextMenuItem";
import nftLinksFactory from "~/helpers/nftLinksFactory";

type Props = {
  contract: string,
  tokenId: string,
  currencyId: string,
  leftClick?: boolean,
  children: any,
};

const NFTContextMenu = ({ leftClick, children, contract, tokenId, currencyId }: Props) => {
  const { t } = useTranslation();
  const { status, metadata } = useNftMetadata(contract, tokenId, currencyId);
  const links = useMemo(() => nftLinksFactory(currencyId, t, metadata?.links), [
    currencyId,
    metadata?.links,
    t,
  ]);
  const menuItems = useMemo(() => (status === "loaded" ? links : []), [links, status]);

  return (
    <ContextMenuItem leftClick={leftClick} items={menuItems}>
      {children}
    </ContextMenuItem>
  );
};

export default memo<Props>(NFTContextMenu);

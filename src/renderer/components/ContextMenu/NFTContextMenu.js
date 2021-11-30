// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import IconOpensea from "~/renderer/icons/Opensea";
import IconRarible from "~/renderer/icons/Rarible";
import IconGlobe from "~/renderer/icons/Globe";
import { openURL } from "~/renderer/linking";
import ContextMenuItem from "./ContextMenuItem";

type Props = {
  contract: string,
  tokenId: string,
  leftClick?: boolean,
  children: any,
};

export default function NFTContextMenu({ leftClick, children, contract, tokenId }: Props) {
  const { t } = useTranslation();
  const { metadata } = useNftMetadata(contract, tokenId);

  const menuItems = [
    {
      key: "opensea",
      label: t("NFT.viewer.actions.open", { viewer: "Opensea.io" }),
      Icon: IconOpensea,
      type: "external",
      callback: () => openURL(metadata?.links?.opensea),
    },
    {
      key: "rarible",
      label: t("NFT.viewer.actions.open", { viewer: "Rarible" }),
      Icon: IconRarible,
      type: "external",
      callback: () => openURL(metadata?.links?.rarible),
    },
    {
      key: "sep2",
      type: "separator",
      label: "",
    },
    {
      key: "etherscan",
      label: t("NFT.viewer.actions.open", { viewer: "Explorer" }),
      Icon: IconGlobe,
      type: "external",
      callback: () => openURL(metadata?.links?.etherscan),
    },
  ];

  return (
    <ContextMenuItem leftClick={leftClick} items={menuItems}>
      {children}
    </ContextMenuItem>
  );
}

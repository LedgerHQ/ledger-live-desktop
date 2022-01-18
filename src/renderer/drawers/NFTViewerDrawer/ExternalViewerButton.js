// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";
import IconDots from "~/renderer/icons/Dots";
import IconExternal from "~/renderer/icons/ExternalLink";
import IconOpensea from "~/renderer/icons/Opensea";
import IconRarible from "~/renderer/icons/Rarible";
import IconGlobe from "~/renderer/icons/Globe";
import { openURL } from "~/renderer/linking";

import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import type { NFTMetadataResponse } from "@ledgerhq/live-common/lib/types";

const Separator: ThemedComponent<{}> = styled.div`
  background-color: ${p => p.theme.colors.palette.divider};
  height: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Item: ThemedComponent<{
  disableHover?: boolean,
}> = styled(DropDownItem)`
  width: 100%;
  cursor: pointer;
  white-space: pre-wrap;
  justify-content: space-between;
  align-items: center;
  display: flex;
`;

type ItemType = DropDownItemType & {
  icon?: React$Element<*>,
  onClick?: Function,
  type?: "separator",
};

type ExternalViewerButtonProps = {
  links: $PropertyType<$PropertyType<NFTMetadataResponse, "result">, "links">,
  contract: string,
  tokenId: string,
};

export const ExternalViewerButton = ({ links, contract, tokenId }: ExternalViewerButtonProps) => {
  const { t } = useTranslation();

  const defaultLinks = {
    openSea: `https://opensea.io/assets/${contract}/${tokenId}`,
    rarible: `https://rarible.com/token/${contract}:${tokenId}`,
    etherscan: `https://etherscan.io/token/${contract}?a=${tokenId}`,
  };

  const items: DropDownItemType[] = [
    {
      key: "opensea",
      label: t("NFT.viewer.actions.open", { viewer: "Opensea.io" }),
      icon: <IconOpensea size={16} />,
      onClick: () => openURL(links?.opensea || defaultLinks.openSea),
    },
    {
      key: "rarible",
      label: t("NFT.viewer.actions.open", { viewer: "Rarible" }),
      icon: <IconRarible size={16} />,
      onClick: () => openURL(links?.rarible || defaultLinks.rarible),
    },
    {
      key: "sep2",
      type: "separator",
      label: "",
    },
    {
      key: "etherscan",
      label: t("NFT.viewer.actions.open", { viewer: "Explorer" }),
      icon: <IconGlobe size={16} />,
      onClick: () => openURL(links?.etherscan || defaultLinks.etherscan),
    },
  ];

  const renderItem = ({ item }: { item: ItemType }) => {
    if (item.type === "separator") {
      return <Separator />;
    }

    return (
      <Item
        id={`external-popout-${item.key}`}
        horizontal
        flow={2}
        onClick={item.onClick}
        disableHover={item.key === "hideEmpty"}
      >
        <Box horizontal>
          {item.icon ? <Box mr={2}>{item.icon}</Box> : null}
          {item.label}
        </Box>
        <Box ml={4}>
          <IconExternal size={16} />
        </Box>
      </Item>
    );
  };

  return (
    <DropDownSelector
      buttonId="accounts-options-button"
      horizontal
      items={items}
      renderItem={renderItem}
    >
      {() => (
        <Box horizontal>
          <Button small primary flow={1} style={{ height: 40 }}>
            <IconDots size={14} />
          </Button>
        </Box>
      )}
    </DropDownSelector>
  );
};

// @flow

import React, { useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";
import IconDots from "~/renderer/icons/Dots";
import IconExternal from "~/renderer/icons/ExternalLink";
import nftLinksFactory from "~/helpers/nftLinksFactory";

import type { NFTMetadataResponse } from "@ledgerhq/live-common/lib/types";
import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

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

type ExternalViewerButtonProps = {
  links: $PropertyType<$PropertyType<NFTMetadataResponse, "result">, "links">,
  contract: string,
  tokenId: string,
  currencyId: string,
};

const ExternalViewerButton = ({
  links,
  contract,
  tokenId,
  currencyId,
}: ExternalViewerButtonProps) => {
  const { t } = useTranslation();

  const items: DropDownItemType[] = useMemo(() => nftLinksFactory(currencyId, t, links), [
    currencyId,
    links,
    t,
  ]);

  const renderItem = ({ item }) => {
    if (item.type === "separator") {
      return <Separator />;
    }

    const Icon = item.Icon ? React.createElement(item.Icon, { size: 16 }) : <></>;

    return (
      <Item
        id={`external-popout-${item.id}`}
        horizontal
        flow={2}
        onClick={item.onClick}
        disableHover={item.id === "hideEmpty"}
      >
        <Box horizontal>
          {item.Icon ? <Box mr={2}>{Icon}</Box> : null}
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

// $FlowFixMe
export default memo(ExternalViewerButton);

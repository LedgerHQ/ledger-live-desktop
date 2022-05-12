// @flow

import React, { useCallback, memo } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";
import IconDots from "~/renderer/icons/Dots";
import IconExternal from "~/renderer/icons/ExternalLink";
import useNftLinks from "~/renderer/hooks/useNftLinks";
import { setDrawer } from "~/renderer/drawers/Provider";

import type { Account, ProtoNFT, NFTMetadata } from "@ledgerhq/live-common/lib/types";
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
      onClick={item.callback}
      disableHover={item.id === "hideEmpty"}
    >
      <Box horizontal>
        {item.Icon ? <Box mr={2}>{Icon}</Box> : null}
        {item.label}
      </Box>
      {item.type === "external" ? (
        <Box ml={4}>
          <IconExternal size={16} />
        </Box>
      ) : null}
    </Item>
  );
};

type ExternalViewerButtonProps = {
  nft: ProtoNFT,
  account: Account,
  metadata: NFTMetadata,
};

const ExternalViewerButton = ({ nft, account, metadata }: ExternalViewerButtonProps) => {
  const history = useHistory();
  const onHideCollection = useCallback(() => {
    setDrawer();
    history.replace(`/account/${account.id}/`);
  }, [account.id, history]);
  const items = useNftLinks(account, nft, metadata, onHideCollection);

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

export default memo<ExternalViewerButtonProps>(ExternalViewerButton);

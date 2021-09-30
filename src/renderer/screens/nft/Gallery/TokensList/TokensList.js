// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { useNfts, nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import Box, { Card } from "~/renderer/components/Box";
import { useDispatch, useSelector } from "react-redux";
import { nftsViewModeSelector } from "~/renderer/reducers/settings";
import { setNftsViewMode } from "~/renderer/actions/settings";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import GridIcon from "~/renderer/icons/Grid";
import ListIcon from "~/renderer/icons/List";

import Item from "./Item";

type Props = {
  account: Account,
  collectionId?: string,
};

const Container: ThemedComponent<{ mode?: "grid" | "list" }> = styled(Box)`
  display: ${p => (p.mode === "list" ? "flex" : "grid")};
  grid-gap: ${p => (p.mode === "list" ? 10 : 18)}px;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
`;

const ToggleButton: ThemedComponent<{ active?: boolean }> = styled(Button)`
  height: 30px;
  width: 30px;
  padding: 7px;
  background: ${p =>
    p.active ? p.theme.colors.pillActiveBackground : p.theme.colors.palette.background.paper};
  color: ${p => (p.active ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
`;

const TokensList = ({ account, collectionId }: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const nftsViewMode = useSelector(nftsViewModeSelector);

  const nfts = useNfts(account.nfts, account.currency);
  const collections = nftsByCollections(nfts, collectionId);
  const setListMode = useCallback(() => dispatch(setNftsViewMode("list")), [dispatch]);
  const setGridMode = useCallback(() => dispatch(setNftsViewMode("grid")), [dispatch]);

  const onSelectCollection = useCallback(
    collectionId => {
      history.push({ pathname: `/account/${account.id}/nft-collection/${collectionId}` });
    },
    [account.id, history],
  );

  return (
    <>
      <Card horizontal justifyContent="flex-end" p={3} mb={3}>
        <ToggleButton mr={1} active={nftsViewMode === "list"} onClick={setListMode}>
          <ListIcon />
        </ToggleButton>
        <ToggleButton active={nftsViewMode === "grid"} onClick={setGridMode}>
          <GridIcon />
        </ToggleButton>
      </Card>

      {collections.map(({ contract, tokenName, nfts }) => (
        <div key={contract}>
          {!collectionId ? (
            <Box mb={2} onClick={() => onSelectCollection(contract)}>
              <Text ff="Inter|Medium" fontSize={6} color="palette.text.shade100">
                {tokenName}
              </Text>
            </Box>
          ) : null}
          <Container mb={20} mode={nftsViewMode}>
            {nfts.map(nft => (
              <Item key={nft.tokenId} mode={nftsViewMode} nft={nft} />
            ))}
          </Container>
        </div>
      ))}
    </>
  );
};

export default TokensList;

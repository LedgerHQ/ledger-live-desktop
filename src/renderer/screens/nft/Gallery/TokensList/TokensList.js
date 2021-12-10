// @flow

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import Box, { Card } from "~/renderer/components/Box";
import { useDispatch, useSelector } from "react-redux";
import { nftsViewModeSelector } from "~/renderer/reducers/settings";
import { setNftsViewMode } from "~/renderer/actions/settings";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import GridIcon from "~/renderer/icons/Grid";
import ListIcon from "~/renderer/icons/List";
import CollectionName from "~/renderer/screens/nft/CollectionName";
import NFTContextMenu from "~/renderer/components/ContextMenu/NFTContextMenu";
import Spinner from "~/renderer/components/Spinner";
import useOnScreen from "../../useOnScreen";
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

const SpinnerContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SpinnerBackground: ThemedComponent<{}> = styled.div`
  background: ${p => p.theme.colors.palette.background.paper};
  border-radius: 100%;
  padding: 2px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${p => p.theme.colors.palette.background.paper};
`;

const TokensList = ({ account, collectionId }: Props) => {
  const ref = useRef();
  const isAtBottom = useOnScreen(ref);
  const [maxVisibleNTFs, setMaxVisibleNFTs] = useState(1);
  const history = useHistory();
  const dispatch = useDispatch();
  const nftsViewMode = useSelector(nftsViewModeSelector);

  useEffect(() => {
    if (isAtBottom) {
      setMaxVisibleNFTs(maxVisibleNTFs => maxVisibleNTFs + 5);
    }
  }, [isAtBottom]);

  const collections = nftsByCollections(account.nfts, collectionId);
  const setListMode = useCallback(() => dispatch(setNftsViewMode("list")), [dispatch]);
  const setGridMode = useCallback(() => dispatch(setNftsViewMode("grid")), [dispatch]);

  const onSelectCollection = useCallback(
    collectionId => {
      history.push({ pathname: `/account/${account.id}/nft-collection/${collectionId}` });
    },
    [account.id, history],
  );

  const galleryRender = useMemo(() => {
    const result = [];
    let count = 0;
    let shortcircuit = false;

    for (const collection of collections) {
      const children = [];
      if (shortcircuit) break;

      for (const nft of collection.nfts) {
        if (count++ > maxVisibleNTFs) {
          shortcircuit = true;
          break;
        }
        // We can still add more nfts
        children.push(
          <NFTContextMenu key={nft.id} contract={collection.contract} tokenId={nft.tokenId}>
            <Item
              mode={nftsViewMode}
              id={nft.id}
              tokenId={nft.tokenId}
              contract={collection.contract}
              account={account}
            />
          </NFTContextMenu>,
        );
      }

      if (children.length) {
        // Consider adding the collection only if have children
        result.push(
          <div key={collection.contract}>
            {!collectionId ? (
              <Box mb={2} onClick={() => onSelectCollection(collection.contract)}>
                <Text ff="Inter|Medium" fontSize={6} color="palette.text.shade100">
                  <CollectionName collection={collection} fallback={collection.contract} />
                </Text>
              </Box>
            ) : null}
            <Container mb={20} mode={nftsViewMode}>
              {children}
              {children.length < count ? (
                <SpinnerContainer>
                  <SpinnerBackground>
                    <Spinner size={14} />
                  </SpinnerBackground>
                </SpinnerContainer>
              ) : null}
            </Container>
          </div>,
        );
      }
    }
    return result;
  }, [collectionId, collections, maxVisibleNTFs, nftsViewMode, onSelectCollection, account]);

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
      {galleryRender}
      <div ref={ref} />
    </>
  );
};

export default TokensList;

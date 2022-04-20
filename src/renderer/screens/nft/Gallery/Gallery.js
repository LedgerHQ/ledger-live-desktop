// @flow

import React, { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { accountSelector } from "~/renderer/reducers/accounts";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openModal } from "~/renderer/actions/modals";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import styled from "styled-components";
import IconSend from "~/renderer/icons/Send";
import CollectionName from "~/renderer/screens/nft/CollectionName";
import TokensList from "./TokensList";
import Box from "~/renderer/components/Box";
import Spinner from "~/renderer/components/Spinner";
import useOnScreen from "../useOnScreen";
import TrackPage from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import GridListToggle from "./GridListToggle";

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

const Gallery = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const account = useSelector(state => accountSelector(state, { accountId: id }));
  const history = useHistory();

  const collections = nftsByCollections(account.nfts);

  const onSend = useCallback(() => {
    dispatch(openModal("MODAL_SEND", { account, isNFTSend: true }));
  }, [dispatch, account]);

  const onSelectCollection = useCallback(
    collectionAddress => {
      history.push({ pathname: `/account/${account.id}/nft-collection/${collectionAddress}` });
    },
    [account.id, history],
  );

  const ref = useRef();
  const isAtBottom = useOnScreen(ref);
  const [maxVisibleNFTs, setMaxVisibleNFTs] = useState(1);

  const totalNFTs = useMemo(() => collections.map(c => c.nfts.length).reduce((a, b) => a + b), [
    collections,
  ]);

  useEffect(() => {
    if (isAtBottom && maxVisibleNFTs < totalNFTs) {
      setMaxVisibleNFTs(maxVisibleNFTs => maxVisibleNFTs + 5);
    }
  }, [isAtBottom]);

  const [collectionsRender, isLoading] = useMemo(() => {
    const collectionsRender = [];
    let isLoading = false;
    let displayedNFTs = 0;
    collections.forEach(collection => {
      if (displayedNFTs > maxVisibleNFTs) return;
      collectionsRender.push(
        <div key={collection.contract}>
          <Box mb={2} onClick={() => onSelectCollection(collection.contract)}>
            <Text ff="Inter|Medium" fontSize={6} color="palette.text.shade100">
              <CollectionName collection={collection} fallback={collection.contract} />
            </Text>
          </Box>
          <TokensList
            collectionAddress={collection.contract}
            account={account}
            nfts={collection.nfts.slice(0, maxVisibleNFTs - displayedNFTs)}
          />
        </div>,
      );

      if (displayedNFTs + collection.nfts.length > maxVisibleNFTs) {
        isLoading = true;
      }

      displayedNFTs += collection.nfts.length;
    });

    return [collectionsRender, isLoading];
  }, [collections, maxVisibleNFTs, account]);

  return (
    <>
      <TrackPage category="Page" name="NFT Gallery" />
      <Box horizontal alignItems="center" mb={6}>
        <Box flex={1}>
          <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={22} flex={1}>
            {t("NFT.gallery.title")}
          </Text>
        </Box>
        <Button small primary icon onClick={onSend}>
          <Box horizontal flow={1} alignItems="center">
            <IconSend size={12} />
            <Box>{t("NFT.gallery.collection.header.sendCTA")}</Box>
          </Box>
        </Button>
      </Box>
      <GridListToggle />
      {collectionsRender}
      {isLoading && (
        <SpinnerContainer>
          <SpinnerBackground>
            <Spinner size={14} />
          </SpinnerBackground>
        </SpinnerContainer>
      )}
      <div ref={ref} />
    </>
  );
};

export default Gallery;

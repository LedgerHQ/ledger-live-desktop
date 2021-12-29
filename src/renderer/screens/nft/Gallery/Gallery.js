// @flow

import React, { useCallback, useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { accountSelector } from "~/renderer/reducers/accounts";
import { openModal } from "~/renderer/actions/modals";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import IconSend from "~/renderer/icons/Send";
import CollectionName from "~/renderer/screens/nft/CollectionName";
import TokensList from "./TokensList";
import Box from "~/renderer/components/Box";
import useOnScreen from "../useOnScreen";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import GridListToggle from "./GridListToggle";

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
    collectionId => {
      history.push({ pathname: `/account/${account.id}/nft-collection/${collectionId}` });
    },
    [account.id, history],
  );

  const ref = useRef();
  const isAtBottom = useOnScreen(ref);
  const [maxVisibleNTFs, setMaxVisibleNFTs] = useState(1);

  useEffect(() => {
    if (isAtBottom) {
      setMaxVisibleNFTs(maxVisibleNTFs => maxVisibleNTFs + 5);
    }
  }, [isAtBottom]);

  const collectionsRender = [];
  let displayedNFTs = 0;
  collections.forEach(collection => {
    if (displayedNFTs > maxVisibleNTFs) return;
    collectionsRender.push(
      <div key={collection.contract}>
        <Box mb={2} onClick={() => onSelectCollection(collection.contract)}>
          <Text ff="Inter|Medium" fontSize={6} color="palette.text.shade100">
            <CollectionName collection={collection} fallback={collection.contract} />
          </Text>
        </Box>
        <TokensList
          collectionId={collection.contract}
          account={account}
          nfts={collection.nfts.slice(0, maxVisibleNTFs - displayedNFTs)}
          isLoading={displayedNFTs + collection.nfts.length > maxVisibleNTFs}
        />
      </div>,
    );

    displayedNFTs += collection.nfts.length;
  });

  return (
    <>
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
      <div ref={ref} />
    </>
  );
};

export default Gallery;

// @flow

import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNfts, nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import { accountSelector } from "~/renderer/reducers/accounts";
import { openModal } from "~/renderer/actions/modals";
import Image from "~/renderer/screens/nft/Image";
import IconSend from "~/renderer/icons/Send";
import TokensList from "./TokensList";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import OperationsList from "~/renderer/components/OperationsList";

const Gallery = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id, collectionId } = useParams();
  const account = useSelector(state => accountSelector(state, { accountId: id }));
  const nfts = useNfts(account.nfts, account.currency);
  const collection = nftsByCollections(nfts, collectionId)[0];

  const onSend = useCallback(() => {
    // TODO use nft send
    dispatch(openModal("MODAL_SEND", { account }));
  }, [account, dispatch]);

  // NB To be determined if this filter is good enough for what we expect.
  const filterOperation = op =>
    !!op.nftOperations?.length && !!op.nftOperations.find(nftOp => nftOp.contract === collectionId);

  return (
    <>
      <Box horizontal alignItems="center" mb={6}>
        {collectionId && collection ? (
          <>
            <Image size={40} nft={collection.nfts[0]} />
            <Box flex={1} ml={3}>
              <Text ff="Inter|Regular" color="palette.text.shade60" fontSize={2}>
                {t("NFT.gallery.collection.header.contract", { contract: collection.contract })}
              </Text>
              <Text uppercase ff="Inter|SemiBold" color="palette.text.shade100" fontSize={22}>
                {collection.tokenName}
              </Text>
            </Box>
          </>
        ) : (
          <Box flex={1}>
            <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={22} flex={1}>
              {t("NFT.gallery.title")}
            </Text>
          </Box>
        )}
        <Button small primary icon onClick={onSend}>
          <Box horizontal flow={1} alignItems="center">
            <IconSend size={12} />
            <Box>{t("NFT.gallery.collection.header.sendCTA")}</Box>
          </Box>
        </Button>
      </Box>
      <TokensList account={account} collectionId={collectionId} />
      {collectionId && (
        <OperationsList
          account={account}
          title={t("NFT.gallery.collection.operationList.header")}
          filterOperation={collectionId ? filterOperation : undefined}
        />
      )}
    </>
  );
};

export default Gallery;

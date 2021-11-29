// @flow

import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { accountSelector } from "~/renderer/reducers/accounts";
// import { openModal } from "~/renderer/actions/modals";
import Image from "~/renderer/screens/nft/Image";
// import IconSend from "~/renderer/icons/Send";
import TokensList from "./TokensList";
import Box from "~/renderer/components/Box";
// import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import OperationsList from "~/renderer/components/OperationsList";
import CollectionName from "../CollectionName";
import Skeleton from "../Skeleton";

const Gallery = () => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  const { id, collectionId } = useParams();
  const account = useSelector(state => accountSelector(state, { accountId: id }));
  const collection = nftsByCollections(account.nfts, collectionId)[0];

  const { status, metadata } = useNftMetadata(collection.contract, collection.nfts[0].tokenId);
  const show = useMemo(() => status === "loading", [status]);

  // const onSend = useCallback(() => {
  //   dispatch(openModal("MODAL_SEND", { isNFTSend: true, nftCollection: collectionId }));
  // }, [collectionId, dispatch]);

  // NB To be determined if this filter is good enough for what we expect.
  const filterOperation = op =>
    !!op.nftOperations?.length && !!op.nftOperations.find(nftOp => nftOp.contract === collectionId);

  return (
    <>
      <Box horizontal alignItems="center" mb={6}>
        {collectionId && collection ? (
          <>
            <Skeleton width={40} minHeight={40} show={show}>
              <Image size={40} nft={metadata} />
            </Skeleton>
            <Box flex={1} ml={3}>
              <Skeleton width={93} barHeight={6} minHeight={24} show={show}>
                <Text ff="Inter|Regular" color="palette.text.shade60" fontSize={2}>
                  {t("NFT.gallery.collection.header.contract", {
                    contract: collection.contract,
                  })}
                </Text>
              </Skeleton>
              <Skeleton width={143} minHeight={33} barHeight={12} show={show}>
                <Text uppercase ff="Inter|SemiBold" color="palette.text.shade100" fontSize={22}>
                  <CollectionName collection={collection} />
                </Text>
              </Skeleton>
            </Box>
          </>
        ) : (
          <Box flex={1}>
            <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={22} flex={1}>
              {t("NFT.gallery.title")}
            </Text>
          </Box>
        )}
        {/* <Button small primary icon onClick={onSend}>
          <Box horizontal flow={1} alignItems="center">
            <IconSend size={12} />
            <Box>{t("NFT.gallery.collection.header.sendCTA")}</Box>
          </Box>
        </Button> */}
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

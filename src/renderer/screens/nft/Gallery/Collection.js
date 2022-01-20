// @flow

import React, { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft/NftMetadataProvider";
import { accountSelector } from "~/renderer/reducers/accounts";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { openModal } from "~/renderer/actions/modals";
import styled from "styled-components";
import useOnScreen from "../useOnScreen";
import Image from "~/renderer/screens/nft/Image";
import IconSend from "~/renderer/icons/Send";
import TokensList from "./TokensList";
import Spinner from "~/renderer/components/Spinner";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import OperationsList from "~/renderer/components/OperationsList";
import CollectionName from "../CollectionName";
import GridListToggle from "./GridListToggle";
import Skeleton from "../Skeleton";

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

const Collection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id, collectionAddress } = useParams();
  const account = useSelector(state => accountSelector(state, { accountId: id }));

  const collection = useMemo(() => nftsByCollections(account.nfts, collectionAddress)[0], [
    account.nfts,
    collectionAddress,
  ]);

  const { status, metadata } = useNftMetadata(collection.contract, collection.nfts[0].tokenId);
  const show = useMemo(() => status === "loading", [status]);

  const onSend = useCallback(() => {
    dispatch(
      openModal("MODAL_SEND", { account, isNFTSend: true, nftCollection: collectionAddress }),
    );
  }, [collectionAddress, dispatch, account]);

  // NB To be determined if this filter is good enough for what we expect.
  const filterOperation = op =>
    !!op.nftOperations?.length &&
    !!op.nftOperations.find(nftOp => nftOp.contract === collectionAddress);

  const ref = useRef();
  const isAtBottom = useOnScreen(ref);
  const [maxVisibleNTFs, setMaxVisibleNFTs] = useState(1);

  useEffect(() => {
    if (isAtBottom && maxVisibleNTFs < collection.nfts.length) {
      setMaxVisibleNFTs(maxVisibleNTFs => maxVisibleNTFs + 5);
    }
  }, [isAtBottom]);

  const slicedNfts = useMemo(() => collection.nfts.slice(0, maxVisibleNTFs), [
    collection.nfts,
    maxVisibleNTFs,
  ]);

  return (
    <>
      <Box horizontal alignItems="center" mb={6}>
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
            <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={22}>
              <CollectionName collection={collection} />
            </Text>
          </Skeleton>
        </Box>
        <Button small primary icon onClick={onSend}>
          <Box horizontal flow={1} alignItems="center">
            <IconSend size={12} />
            <Box>{t("NFT.gallery.collection.header.sendCTA")}</Box>
          </Box>
        </Button>
      </Box>
      <GridListToggle />
      <TokensList account={account} collectionAddress={collectionAddress} nfts={slicedNfts} />
      {collection.nfts.length > maxVisibleNTFs && (
        <SpinnerContainer>
          <SpinnerBackground>
            <Spinner size={14} />
          </SpinnerBackground>
        </SpinnerContainer>
      )}
      <div ref={ref} />
      <OperationsList
        account={account}
        title={t("NFT.gallery.collection.operationList.header")}
        filterOperation={collectionAddress ? filterOperation : undefined}
      />
    </>
  );
};

export default Collection;

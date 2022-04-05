// @flow

import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { track } from "~/renderer/analytics/segment";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";
import { TokenShowMoreIndicator, IconAngleDown } from "~/renderer/screens/account/TokensList";
import IconReceive from "~/renderer/icons/Receive";
import AngleDown from "~/renderer/icons/AngleDown";
import Row from "./Row";
import { useHistory } from "react-router-dom";
import { openModal } from "~/renderer/actions/modals";
import Spinner from "~/renderer/components/Spinner";
import { hiddenNftCollectionsSelector } from "~/renderer/reducers/settings";

const INCREMENT = 5;
type Props = {
  account: Account,
};

const Collections = ({ account }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [numberOfVisibleCollection, setNumberOfVisibleCollections] = useState(INCREMENT);

  const onOpenGallery = useCallback(() => {
    history.push(`/account/${account.id}/nft-collection`);
  }, [account.id, history]);

  const onReceive = useCallback(() => dispatch(openModal("MODAL_RECEIVE", { account })), [
    account,
    dispatch,
  ]);

  const onOpenCollection = useCallback(
    collectionAddress => history.push(`/account/${account.id}/nft-collection/${collectionAddress}`),
    [account.id, history],
  );

  const collections = useMemo(() => nftsByCollections(account.nfts), [account.nfts]);
  const collectionsLength = Object.keys(collections).length;

  const onShowMore = useCallback(() => {
    setNumberOfVisibleCollections(numberOfVisibleCollection =>
      Math.min(numberOfVisibleCollection + INCREMENT, collectionsLength),
    );
  }, [collectionsLength]);

  const hiddenNftCollections = useSelector(hiddenNftCollectionsSelector);
  const visibleCollection = useMemo(
    () =>
      Object.entries(collections)
        .filter(([contract]) => !hiddenNftCollections.includes(`${account.id}|${contract}`))
        .slice(0, numberOfVisibleCollection)
        .map(([contract, nfts]: any) => (
          <Row
            onClick={() => onOpenCollection(contract)}
            key={contract}
            contract={contract}
            account={account}
            nfts={nfts}
          />
        )),
    [account, collections, hiddenNftCollections, numberOfVisibleCollection, onOpenCollection],
  );

  useEffect(() => {
    track("View NFT Collections (Account Page)");
  }, []);

  return (
    <Box>
      <TableContainer id="tokens-list" mb={50}>
        <TableHeader title={t("NFT.collections.title")}>
          <Button primary mr={2} onClick={onReceive} icon>
            <Box horizontal flow={1} alignItems="center">
              <IconReceive size={14} />
              <Box>{t("NFT.collections.receiveCTA")}</Box>
            </Box>
          </Button>
          <Button primary onClick={onOpenGallery}>
            {t("NFT.collections.galleryCTA")}
          </Button>
        </TableHeader>
        {account.nfts?.length ? (
          visibleCollection
        ) : (
          <Box alignItems="center" justifyContent="center" p={4}>
            <Spinner size={16} />
          </Box>
        )}
        {collectionsLength > numberOfVisibleCollection ? (
          <TokenShowMoreIndicator expanded onClick={onShowMore}>
            <Box horizontal alignContent="center" justifyContent="center" py={3}>
              <Text color="wallet" ff="Inter|SemiBold" fontSize={4}>
                {t("NFT.collections.seeMore")}
              </Text>
              <IconAngleDown>
                <AngleDown size={16} />
              </IconAngleDown>
            </Box>
          </TokenShowMoreIndicator>
        ) : null}
      </TableContainer>
    </Box>
  );
};

export default memo<Props>(Collections);

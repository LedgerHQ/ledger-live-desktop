// @flow

import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { TokenShowMoreIndicator, IconAngleDown } from "~/renderer/screens/account/TokensList";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";
import { hiddenNftCollectionsSelector } from "~/renderer/reducers/settings";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { supportLinkByTokenType } from "~/config/urls";
import { openModal } from "~/renderer/actions/modals";
import { track } from "~/renderer/analytics/segment";
import AngleDown from "~/renderer/icons/AngleDown";
import IconReceive from "~/renderer/icons/Receive";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Row from "./Row";

const INCREMENT = 5;

const EmptyState: ThemedComponent<{}> = styled.div`
  padding: 15px 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  > :first-child {
    flex: 1;
  }
  > :nth-child(2) {
    align-self: center;
  }
`;

const Placeholder: ThemedComponent<{}> = styled.div`
  flex-direction: column;
  display: flex;
  padding-right: 50px;
`;

type Props = {
  account: Account,
};

const Collections = ({ account }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [numberOfVisibleCollections, setNumberOfVisibleCollections] = useState(INCREMENT);

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
    setNumberOfVisibleCollections(numberOfVisibleCollections =>
      Math.min(numberOfVisibleCollections + INCREMENT, collectionsLength),
    );
  }, [collectionsLength]);

  const hiddenNftCollections = useSelector(hiddenNftCollectionsSelector);
  const filteredCollections = useMemo(
    () =>
      Object.entries(collections).filter(
        ([contract]) => !hiddenNftCollections.includes(`${account.id}|${contract}`),
      ),
    [account.id, collections, hiddenNftCollections],
  );
  const visibleCollections = useMemo(
    () =>
      filteredCollections
        .slice(0, numberOfVisibleCollections)
        .map(([contract, nfts]: any) => (
          <Row
            onClick={() => onOpenCollection(contract)}
            key={contract}
            contract={contract}
            account={account}
            nfts={nfts}
          />
        )),
    [account, filteredCollections, numberOfVisibleCollections, onOpenCollection],
  );

  useEffect(() => {
    track("View NFT Collections (Account Page)");
  }, []);

  return (
    <Box>
      <TableContainer id="tokens-list" mb={50}>
        <TableHeader title={t("NFT.collections.title")}>
          {visibleCollections?.length ? (
            <>
              <Button primary mr={2} onClick={onReceive} icon>
                <Box horizontal flow={1} alignItems="center">
                  <IconReceive size={14} />
                  <Box>{t("NFT.collections.receiveCTA")}</Box>
                </Box>
              </Button>
              <Button primary onClick={onOpenGallery}>
                {t("NFT.collections.galleryCTA")}
              </Button>
            </>
          ) : null}
        </TableHeader>
        {visibleCollections?.length ? (
          visibleCollections
        ) : (
          <EmptyState>
            <Placeholder>
              <Text color="palette.text.shade80" ff="Inter|SemiBold" fontSize={4}>
                {t("NFT.collections.placeholder", { currency: account.currency.name })}
                &nbsp;
                <LabelWithExternalIcon
                  color="wallet"
                  ff="Inter|SemiBold"
                  onClick={() => {
                    openURL(supportLinkByTokenType.nfts);
                    track(`More info on Manage nfts tokens`);
                  }}
                  label={t("tokensList.link")}
                />
              </Text>
            </Placeholder>
            <Button small primary onClick={onReceive} icon>
              <Box horizontal flow={1} alignItems="center">
                <IconReceive size={12} />
                <Box>{t("NFT.collections.receiveCTA")}</Box>
              </Box>
            </Button>
          </EmptyState>
        )}
        {filteredCollections.length > numberOfVisibleCollections ? (
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

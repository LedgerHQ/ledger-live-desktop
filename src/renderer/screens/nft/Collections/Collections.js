// @flow

import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { useNfts, nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";
import { TokenShowMoreIndicator, IconAngleDown } from "~/renderer/screens/Account/TokensList";
import IconReceive from "~/renderer/icons/Receive";
import AngleDown from "~/renderer/icons/AngleDown";
import Row from "./Row";
import { useHistory } from "react-router-dom";
import { openModal } from "~/renderer/actions/modals";
import Spinner from "~/renderer/components/Spinner";

const VISIBLE_COLLECTIONS = 3;
type Props = {
  account: Account,
};

const Collections = ({ account }: Props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(true);
  const nfts = useNfts(account.nfts, account.currency);

  const toggleCollapse = useCallback(() => {
    setCollapsed(collapsed => !collapsed);
  }, []);

  const onOpenGallery = useCallback(() => {
    history.push(`/account/${account.id}/nft-collection`);
  }, [account.id, history]);

  const onReceive = useCallback(() => dispatch(openModal("MODAL_RECEIVE", { account })), [account]);

  const onOpenCollection = useCallback(
    collectionId => history.push(`/account/${account.id}/nft-collection/${collectionId}`),
    [account.id, history],
  );

  const collections = nftsByCollections(nfts);
  const visibleCollection = collections.slice(
    0,
    !collapsed ? collections.length : VISIBLE_COLLECTIONS,
  );

  return (
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
      {nfts.length ? (
        visibleCollection.map(({ contract, tokenName, nfts }) => (
          <Row
            onClick={() => onOpenCollection(contract)}
            key={contract}
            contract={contract}
            tokenName={tokenName}
            nfts={nfts}
          />
        ))
      ) : (
        <Box alignItems="center" justifyContent="center" p={4}>
          <Spinner size={16} />
        </Box>
      )}
      {visibleCollection.length > VISIBLE_COLLECTIONS ? (
        <TokenShowMoreIndicator expanded={!collapsed} onClick={toggleCollapse}>
          <Box horizontal alignContent="center" justifyContent="center" py={3}>
            <Text color="wallet" ff="Inter|SemiBold" fontSize={4}>
              {t(collapsed ? "NFT.collections.seeAll" : "NFT.collections.seeLess")}
            </Text>
            <IconAngleDown expanded={!collapsed}>
              <AngleDown size={16} />
            </IconAngleDown>
          </Box>
        </TokenShowMoreIndicator>
      ) : null}
    </TableContainer>
  );
};

export default Collections;

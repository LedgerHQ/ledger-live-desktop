// @flow
import React, { useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { accountSelector } from "~/renderer/reducers/accounts";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import { Separator, Item, TextLink, AngleDown, Check } from "./common";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { useNfts } from "@ledgerhq/live-common/lib/nft";

export default function NFTCrumb() {
  const { t } = useTranslation();
  const history = useHistory();
  const { id, collectionId } = useParams();
  const account = useSelector(s => accountSelector(s, { accountId: id }));
  const nfts = useNfts(account.nfts, account.currency);

  // TODO Cleanup once live-common has a helper for this
  const collections = useMemo(() => {
    return nfts.reduce((acc, nft) => {
      const key = nft.collection.contract;
      if (!(key in acc)) {
        acc[key] = {
          ...nft.collection,
          tokens: [],
        };
      }
      // We shouldn't need a dedup on lld side
      if (!acc[key].tokens.find(token => token.id === nft.id)) acc[key].tokens.push(nft);
      return acc;
    }, {});
  }, [nfts]);

  const items = useMemo(
    () =>
      Object.values(collections).map((collection: any) => ({
        key: collection.tokenName,
        label: collection.tokenName,
        collection,
      })),
    [collections],
  );
  const activeItem =
    items.find((item: any) => item.collection.contract === collectionId) || items[0];

  const renderItem = useCallback(
    ({ item, isActive }) => (
      <Item key={item.label} isActive={isActive}>
        <Text ff={`Inter|${isActive ? "SemiBold" : "Regular"}`} fontSize={4}>
          {item.label}
        </Text>
        {isActive && (
          <Check>
            <IconCheck size={14} />
          </Check>
        )}
      </Item>
    ),
    [],
  );

  const onCollectionSelected = useCallback(
    item => {
      if (!item) return;
      const { collection } = item;
      setTrackingSource("NFT breadcrumb");
      history.push({ pathname: `/account/${account.id}/nft-collection/${collection.contract}` });
    },
    [account.id, history],
  );

  const onSeeAll = useCallback(
    item => {
      setTrackingSource("NFT breadcrumb");
      history.push({ pathname: `/account/${account.id}/nft-collection` });
    },
    [account.id, history],
  );

  return (
    <>
      <TextLink>
        <Button onClick={onSeeAll}>{"NFT"}</Button>
      </TextLink>

      {collectionId ? (
        <>
          <Separator />
          <DropDownSelector
            flex={1}
            offsetTop={0}
            border
            horizontal
            items={items}
            controlled
            renderItem={renderItem}
            onChange={onCollectionSelected}
          >
            {({ isOpen, value }) => (
              <TextLink>
                <Button>{activeItem?.label}</Button>
                <AngleDown>
                  {isOpen ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}
                </AngleDown>
              </TextLink>
            )}
          </DropDownSelector>
        </>
      ) : null}
    </>
  );
}

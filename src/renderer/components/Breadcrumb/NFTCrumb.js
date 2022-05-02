// @flow
import React, { useCallback, useMemo, memo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { nftsByCollections } from "@ledgerhq/live-common/lib/nft";
import type { ProtoNFT } from "@ledgerhq/live-common/lib/nft";
import { accountSelector } from "~/renderer/reducers/accounts";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import { Separator, Item, TextLink, AngleDown, Check } from "./common";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import CollectionName from "~/renderer/screens/nft/CollectionName";

const LabelWithMeta = ({
  item,
  isActive,
}: {
  isActive: boolean,
  item: DropDownItemType<ProtoNFT>,
}) => (
  <Item isActive={isActive}>
    <Text ff={`Inter|${isActive ? "SemiBold" : "Regular"}`} fontSize={4}>
      <CollectionName nft={item?.content} fallback={item?.content?.contract} />
    </Text>
    {isActive && (
      <Check>
        <IconCheck size={14} />
      </Check>
    )}
  </Item>
);

const NFTCrumb = () => {
  const history = useHistory();
  const { id, collectionAddress } = useParams();
  const account = useSelector(state => accountSelector(state, { accountId: id }));
  const collections = useMemo(() => nftsByCollections(account.nfts), [account.nfts]);

  const items: DropDownItemType<ProtoNFT>[] = useMemo(
    () =>
      Object.entries(collections).map(([contract, nfts]: [string, any]) => ({
        key: contract,
        label: contract,
        content: nfts[0],
      })),
    [collections],
  );

  const activeItem: ?DropDownItemType<ProtoNFT> = useMemo(
    () => items.find(item => item.key === collectionAddress) || items[0],
    [collectionAddress, items],
  );

  const onCollectionSelected = useCallback(
    item => {
      if (!item) return;
      setTrackingSource("NFT breadcrumb");
      history.push({ pathname: `/account/${account.id}/nft-collection/${item.key}` });
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

      {collectionAddress ? (
        <>
          <Separator />
          <DropDownSelector
            flex={1}
            offsetTop={0}
            border
            horizontal
            items={items}
            controlled
            renderItem={LabelWithMeta}
            onChange={onCollectionSelected}
          >
            {({ isOpen }) => (
              <TextLink>
                <Button>
                  <CollectionName
                    nft={activeItem?.content}
                    fallback={activeItem?.content?.contract}
                  />
                </Button>
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
};

export default memo<{}>(NFTCrumb);

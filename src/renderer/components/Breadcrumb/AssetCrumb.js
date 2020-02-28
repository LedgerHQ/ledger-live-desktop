// @flow

import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useHistory, useParams } from "react-router-dom";

import { getAssetsDistribution } from "@ledgerhq/live-common/lib/portfolio";

import { accountsSelector } from "~/renderer/reducers/accounts";
import { calculateCountervalueSelector } from "~/renderer/actions/general";

import DropDown from "~/renderer/components/DropDown";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";

import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";

import { Separator, Item, TextLink, AngleDown, Check } from "./common";

const distributionSelector = createSelector(
  accountsSelector,
  calculateCountervalueSelector,
  (acc, calc) =>
    getAssetsDistribution(acc, calc, {
      minShowFirst: 6,
      maxShowFirst: 6,
      showFirstThreshold: 0.95,
    }),
);

const AssetCrumb = () => {
  const { t } = useTranslation();
  const distribution = useSelector(distributionSelector);
  const history = useHistory();
  const { assetId } = useParams();

  const renderItem = useCallback(
    ({ item, isActive }) => (
      <Item key={item.currency.id} isActive={isActive}>
        <CryptoCurrencyIcon size={16} currency={item.currency} />
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

  const onAccountSelected = useCallback(
    ({ selectedItem: item }) => {
      if (!item) {
        return null;
      }

      const { currency } = item;

      history.push(`/asset/${currency.id}`);
    },
    [history],
  );

  const processItemsForDropdown = useCallback(
    (items: any[]) =>
      items.map(({ currency }) => ({ key: currency.id, label: currency.name, currency })),
    [],
  );

  const processedItems = useMemo(() => processItemsForDropdown(distribution.list || []), [
    distribution,
    processItemsForDropdown,
  ]);

  const activeItem = useMemo(() => distribution.list.find(dist => dist.currency.id === assetId), [
    assetId,
    distribution.list,
  ]);

  if (!distribution || !distribution.list) return null;
  return (
    <>
      <TextLink>
        <Button onClick={() => history.push("/")}>{t("dashboard.title")}</Button>
      </TextLink>
      <Separator />
      <DropDown
        flex={1}
        offsetTop={0}
        border
        horizontal
        items={processedItems}
        active={activeItem}
        renderItem={renderItem}
        onStateChange={onAccountSelected}
      >
        <TextLink>
          {activeItem && <CryptoCurrencyIcon size={14} currency={activeItem.currency} />}
          <Button>{activeItem.currency.name}</Button>
          <AngleDown>
            <IconAngleDown size={16} />
          </AngleDown>
        </TextLink>
      </DropDown>
    </>
  );
};

export default AssetCrumb;

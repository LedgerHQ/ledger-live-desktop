// @flow
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import { useDistribution } from "~/renderer/actions/general";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { Separator, Item, TextLink, AngleDown, Check } from "./common";

export default function AssetCrumb() {
  const { t } = useTranslation();
  const distribution = useDistribution();
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
    item => {
      if (!item) {
        return;
      }

      const { currency } = item;

      history.push({ pathname: `/asset/${currency.id}`, state: { source: "asset breadcrumb" } });
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
        <Button
          onClick={() => history.push({ pathname: "/", state: { source: "asset breadcrumb" } })}
        >
          {t("dashboard.title")}
        </Button>
      </TextLink>
      <Separator />
      <DropDownSelector
        flex={1}
        offsetTop={0}
        border
        horizontal
        items={processedItems}
        value={{
          label: activeItem ? activeItem.currency.name : "",
          key: activeItem ? activeItem.currency.id : "",
        }}
        controlled
        renderItem={renderItem}
        onChange={onAccountSelected}
      >
        {({ isOpen, value }) =>
          activeItem ? (
            <TextLink>
              <CryptoCurrencyIcon size={14} currency={activeItem.currency} />
              <Button>{activeItem.currency.name}</Button>
              <AngleDown>
                {isOpen ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}
              </AngleDown>
            </TextLink>
          ) : null
        }
      </DropDownSelector>
    </>
  );
}

// @flow
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshAccountsOrdering } from "~/renderer/actions/general";
import { saveSettings } from "~/renderer/actions/settings";
import Track from "~/renderer/analytics/Track";
import BoldToggle from "~/renderer/components/BoldToggle";
import Box from "~/renderer/components/Box";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";
import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import Text from "~/renderer/components/Text";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import { getOrderAccounts } from "~/renderer/reducers/settings";

export default function Order() {
  const orderAccounts = useSelector(getOrderAccounts);
  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onChange = useCallback(
    o => {
      if (!o) return;
      dispatch(saveSettings({ orderAccounts: o.key }));
      refreshAccountsOrdering();
    },
    [refreshAccountsOrdering, dispatch],
  );

  const renderItem = useCallback(props => <OrderItem {...props} />, []);

  const items = useMemo(
    () =>
      ["balance|desc", "balance|asc", "name|asc", "name|desc"].map(key => ({
        key,
        label: t(`accounts.order.${key}`),
      })),
    [t],
  );

  const value = items.find(item => item.key === orderAccounts);

  return (
    <DropDownSelector
      items={items}
      renderItem={renderItem}
      onChange={onChange}
      controlled
      value={value}
    >
      {({ isOpen, value }) =>
        value ? (
          <Box horizontal flow={1}>
            <Track onUpdate event="ChangeSort" orderAccounts={orderAccounts} />
            <Text ff="Inter|SemiBold" fontSize={4}>
              {t("common.sortBy")}
            </Text>
            <Box
              alignItems="center"
              color="wallet"
              ff="Inter|SemiBold"
              flow={1}
              fontSize={4}
              horizontal
            >
              <Text color="wallet">{t(`accounts.order.${value.key}`)}</Text>
              {isOpen ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}
            </Box>
          </Box>
        ) : null
      }
    </DropDownSelector>
  );
}

type ItemProps = {
  item: DropDownItemType,
  isActive: boolean,
};

const OrderItem: React$ComponentType<ItemProps> = React.memo(function OrderItem({
  item,
  isActive,
}: ItemProps) {
  return (
    <DropDownItem
      alignItems="center"
      justifyContent="flex-start"
      horizontal
      isActive={isActive}
      flow={2}
    >
      <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
    </DropDownItem>
  );
});

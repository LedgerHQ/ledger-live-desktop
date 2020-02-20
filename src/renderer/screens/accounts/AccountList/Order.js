// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { refreshAccountsOrdering } from "~/renderer/actions/general";
import { saveSettings } from "~/renderer/actions/settings";
import Track from "~/renderer/analytics/Track";
import BoldToggle from "~/renderer/components/BoldToggle";
import Box from "~/renderer/components/Box";
import DropDown, { DropDownItem } from "~/renderer/components/DropDown";
import type { DropDownItemType } from "~/renderer/components/DropDown";
import Text from "~/renderer/components/Text";
import IconAngleDown from "~/renderer/icons/AngleDown";
import { getOrderAccounts } from "~/renderer/reducers/settings";

const items = ["balance|desc", "balance|asc", "name|asc", "name|desc"].map(key => ({
  key,
  label: <Trans i18nKey={`accounts.order.${key}`} />,
}));

type Props = {
  orderAccounts: string,
  refreshAccountsOrdering: () => *,
  saveSettings: (*) => *,
};

const Order = ({ orderAccounts, saveSettings, refreshAccountsOrdering }: Props) => {
  const onChange = useCallback(
    o => {
      if (!o) return;
      saveSettings({ orderAccounts: o.key });
      refreshAccountsOrdering();
    },
    [saveSettings, refreshAccountsOrdering],
  );

  const renderItem = useCallback(props => <OrderItem {...props} />, []);

  const value = items.find(item => item.key === orderAccounts);

  return (
    <DropDown
      flow={1}
      offsetTop={2}
      horizontal
      items={items}
      renderItem={renderItem}
      onChange={onChange}
      value={value}
    >
      <Track onUpdate event="ChangeSort" orderAccounts={orderAccounts} />
      <Text ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="common.sortBy" />
      </Text>
      <Box alignItems="center" color="wallet" ff="Inter|SemiBold" flow={1} fontSize={4} horizontal>
        <Text color="wallet">
          <Trans i18nKey={`accounts.order.${orderAccounts}`} />
        </Text>
        <IconAngleDown size={16} />
      </Box>
    </DropDown>
  );
};

type ItemProps = {
  item: DropDownItemType,
  isHighlighted: boolean,
  isActive: boolean,
};

const OrderItem: React$ComponentType<ItemProps> = React.memo(function OrderItem({
  item,
  isHighlighted,
  isActive,
}: ItemProps) {
  return (
    <DropDownItem
      alignItems="center"
      justifyContent="flex-start"
      horizontal
      isHighlighted={isHighlighted}
      isActive={isActive}
      flow={2}
    >
      <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
    </DropDownItem>
  );
});

const mapStateToProps = createStructuredSelector({
  orderAccounts: getOrderAccounts,
});

const mapDispatchToProps = {
  refreshAccountsOrdering,
  saveSettings,
};

const ConnectedOrder: React$ComponentType<{}> = connect(mapStateToProps, mapDispatchToProps)(Order);

export default ConnectedOrder;

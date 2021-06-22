// @flow
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import BoldToggle from "~/renderer/components/BoldToggle";
import Box from "~/renderer/components/Box";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";
import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import Text from "~/renderer/components/Text";

export default function Order({ order, setOrder }: *) {
  const { t } = useTranslation();

  const onChange = useCallback(
    o => {
      if (!o) return;
      setOrder(o.key);
    },
    [setOrder],
  );

  const renderItem = useCallback(props => <OrderItem {...props} />, []);

  const items = useMemo(
    () =>
      ["newest", "oldest"].map(key => ({
        key,
        label: t(`nfts.order.${key}`),
      })),
    [t],
  );

  const value = items.find(item => item.key === order);

  return (
    <DropDownSelector
      items={items}
      renderItem={renderItem}
      onChange={onChange}
      controlled
      value={value}
    >
      {({ value }) =>
        value ? (
          <Box id="accounts-order-select-button" horizontal flow={1}>
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
              <Text color="wallet">{t(`nfts.order.${value.key}`)}</Text>
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
      id={`accounts-order-select-${item.key.replace("|", "-")}`}
    >
      <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
    </DropDownItem>
  );
});

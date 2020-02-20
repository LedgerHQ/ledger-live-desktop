// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { PortfolioRange } from "@ledgerhq/live-common/lib/types/portfolio";

import Track from "~/renderer/analytics/Track";
import BoldToggle from "~/renderer/components/BoldToggle";
import Box from "~/renderer/components/Box";
import DropDown, { DropDownItem } from "~/renderer/components/DropDown";
import type { DropDownItemType } from "~/renderer/components/DropDown";
import Text from "~/renderer/components/Text";
import IconAngleDown from "~/renderer/icons/AngleDown";

type Props = {
  onRangeChange: PortfolioRange => void,
  range?: PortfolioRange,
};

type RangeItemProps = {
  item: DropDownItemType,
  isHighlighted: boolean,
  isActive: boolean,
};

const RangeItem = React.memo<RangeItemProps>(function RangeItem({
  item,
  isHighlighted,
  isActive,
}: RangeItemProps) {
  return (
    <DropDownItem
      alignItems="center"
      justifyContent="flex-start"
      horizontal
      isHighlighted={isHighlighted}
      isActive={isActive}
      flow={2}
    >
      <Box grow alignItems="flex-start">
        <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
      </Box>
    </DropDownItem>
  );
});

const Range = ({ range, ...props }: Props) => {
  const { t } = useTranslation();

  const renderItem = useCallback(props => <RangeItem {...props} />, []);

  const rangeItems = [
    {
      key: "week",
      label: t("accounts.range.week"),
    },
    {
      key: "month",
      label: t("accounts.range.month"),
    },
    {
      key: "year",
      label: t("accounts.range.year"),
    },
  ];

  const onRangeChange = ({ selectedItem: item }) => {
    if (!item) {
      return;
    }

    props.onRangeChange(item.key);
  };

  return (
    <DropDown
      flow={1}
      offsetTop={2}
      horizontal
      items={rangeItems}
      renderItem={renderItem}
      onStateChange={onRangeChange}
      value={rangeItems.find(item => item.key === range)}
    >
      <Track onUpdate event="ChangeRange" range={rangeItems} />
      <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize={4}>
        {t("common.range")}
      </Text>
      <Box alignItems="center" color="wallet" ff="Inter|SemiBold" flow={1} fontSize={4} horizontal>
        <Text color="wallet">{t(`accounts.range.${range || "week"}`)}</Text>
        <IconAngleDown size={16} />
      </Box>
    </DropDown>
  );
};

export default React.memo<Props>(Range);

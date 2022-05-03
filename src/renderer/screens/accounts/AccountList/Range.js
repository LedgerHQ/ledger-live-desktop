// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Track from "~/renderer/analytics/Track";
import BoldToggle from "~/renderer/components/BoldToggle";
import Box from "~/renderer/components/Box";
import type { DropDownItemType } from "~/renderer/components/DropDownSelector";
import Text from "~/renderer/components/Text";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import DropDownSelector, { DropDownItem } from "~/renderer/components/DropDownSelector";
import { useTimeRange } from "~/renderer/actions/settings";

type RangeItemProps = {
  item: DropDownItemType<>,
  isActive: boolean,
};

const RangeItem = React.memo<RangeItemProps>(function RangeItem({
  item,
  isActive,
}: RangeItemProps) {
  return (
    <DropDownItem
      alignItems="center"
      justifyContent="flex-start"
      horizontal
      isActive={isActive}
      flow={2}
    >
      <Box grow alignItems="flex-start">
        <BoldToggle isBold={isActive}>{item.label}</BoldToggle>
      </Box>
    </DropDownItem>
  );
});

function Range() {
  const { t } = useTranslation();

  const renderItem = useCallback(props => <RangeItem {...props} />, []);
  const [range, onRangeChange, rangeItems] = useTimeRange();

  return (
    // $FlowFixMe DropDownSelector is not typed well
    <DropDownSelector
      items={rangeItems}
      renderItem={renderItem}
      onChange={onRangeChange}
      controlled
      value={rangeItems.find(item => item.key === range)}
    >
      {({ isOpen, value }) =>
        value ? (
          <Box horizontal flow={1}>
            <Track onUpdate event="ChangeRange" range={rangeItems} />
            <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize={4}>
              {t("common.range")}
            </Text>
            <Box
              alignItems="center"
              color="wallet"
              ff="Inter|SemiBold"
              flow={1}
              fontSize={4}
              horizontal
            >
              <Text color="wallet">{t(`accounts.range.${value.key || "week"}`)}</Text>
              {isOpen ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}
            </Box>
          </Box>
        ) : null
      }
    </DropDownSelector>
  );
}

export default React.memo<{}>(Range);

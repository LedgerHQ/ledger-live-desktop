// @flow

import React, { useCallback, memo } from "react";
import { Trans } from "react-i18next";
import DropDown, { DropDownItem } from "~/renderer/components/DropDown";
import Box from "~/renderer/components/Box";
import BoldToggle from "~/renderer/components/BoldToggle";
import Text from "~/renderer/components/Text";
import IconAngleDown from "~/renderer/icons/AngleDown";

type Props = {
  onSortChange: Function,
  sort: { type: string, order: string },
};

const Sort = ({ onSortChange, sort }: Props) => {
  const onSortChangeWrapper = useCallback(
    ({ selectedItem: item }) => {
      if (!item) {
        return;
      }
      onSortChange(item.sort);
    },
    [onSortChange],
  );

  const sortItems = [
    {
      key: "marketcap_desc",
      sort: { type: "marketcap", order: "desc" },
      label: <Trans i18nKey="manager.applist.sort.marketcap_desc" />,
    },
    {
      key: "name_asc",
      sort: { type: "name", order: "asc" },
      label: <Trans i18nKey="manager.applist.sort.name_asc" />,
    },
    {
      key: "name_desc",
      sort: { type: "name", order: "desc" },
      label: <Trans i18nKey="manager.applist.sort.name_desc" />,
    },
  ];

  const renderItem = useCallback(
    ({ item, isHighlighted, isActive }) => (
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
    ),
    [],
  );

  const key = `${sort.type}_${sort.order}`;

  return (
    <DropDown
      flow={1}
      offsetTop={2}
      horizontal
      items={sortItems}
      renderItem={renderItem}
      onStateChange={onSortChangeWrapper}
      value={sortItems.find(item => item.key === key)}
    >
      <Text color="palette.text.shade60" ff="Inter|SemiBold" fontSize={4}>
        <Trans i18nKey="manager.applist.sort.title" />
      </Text>
      <Box alignItems="center" color="wallet" ff="Inter|SemiBold" flow={1} fontSize={4} horizontal>
        <Text color="wallet">
          <Trans i18nKey={`manager.applist.sort.${key}`} />
        </Text>
        <IconAngleDown size={16} />
      </Box>
    </DropDown>
  );
};

export default memo<Props>(Sort);

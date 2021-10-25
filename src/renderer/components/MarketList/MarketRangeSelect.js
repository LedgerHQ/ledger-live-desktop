// @flow
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "~/renderer/components/Box";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import Ellipsis from "~/renderer/components/Ellipsis";
import { AngleDown, Check, Item, TextLink } from "~/renderer/components/Breadcrumb/common";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import Button from "~/renderer/components/Button";
import { getMarketCryptoCurrencies } from "~/renderer/actions/market";

export const rangesArr = [
  {
    value: "1h",
    label: "Last 1 hour",
    key: "1h",
    pill: "1h",
  },
  {
    value: "24h",
    label: "Last 24 hours",
    key: "24h",
    pill: "1D",
  },
  {
    value: "7d",
    label: "Last week",
    key: "7d",
    pill: "1W",
  },
  {
    value: "30d",
    label: "Last month",
    key: "30d",
    pill: "1M",
  },
  {
    value: "1y",
    label: "Last year",
    key: "1y",
    pill: "1Y",
  },
];

export const MarketRangeSelect = () => {
  const { range } = useSelector(state => state.market);
  const dispatch = useDispatch();
  const onRangeSelected = useCallback(
    item => {
      dispatch(getMarketCryptoCurrencies({ range: item.value }));
    },
    [dispatch],
  );

  const renderItem = useCallback(({ item, isActive }) => {
    return (
      <Item key={item.key} isActive={isActive}>
        <Ellipsis ff={`Inter|${isActive ? "SemiBold" : "Regular"}`} fontSize={4}>
          {item.label}
        </Ellipsis>
        {isActive && (
          <Check>
            <IconCheck size={14} />
          </Check>
        )}
      </Item>
    );
  }, []);

  return (
    <Box horizontal flow={2} alignItems="center" justifyContent="flex-end">
      <DropDownSelector
        border
        horizontal
        items={rangesArr}
        renderItem={renderItem}
        onChange={onRangeSelected}
        controlled
        value={rangesArr.find(a => a.value === range)}
      >
        {({ isOpen, value }) =>
          value ? (
            <Box flex={1} horizontal>
              <TextLink shrink>
                <Button>
                  <Ellipsis>{value.label}</Ellipsis>
                </Button>
                <AngleDown>
                  {isOpen ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}
                </AngleDown>
              </TextLink>
            </Box>
          ) : null
        }
      </DropDownSelector>
    </Box>
  );
};

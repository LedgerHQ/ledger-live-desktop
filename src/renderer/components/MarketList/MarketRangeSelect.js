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
import { useTranslation } from "react-i18next";

export const rangesArr = [
  {
    value: "1h",
    selectorLabel: "Last 1 hour",
    key: "1h",
    label: "1H",
  },
  {
    value: "24h",
    selectorLabel: "Last 24 hours",
    key: "24h",
    label: "1D",
  },
  {
    value: "7d",
    selectorLabel: "Last week",
    key: "7d",
    label: "1W",
  },
  {
    value: "30d",
    selectorLabel: "Last month",
    key: "30d",
    label: "1M",
  },
  {
    value: "1y",
    selectorLabel: "Last year",
    key: "1y",
    label: "1Y",
  },
];

export const MarketRangeSelect = () => {
  const { range } = useSelector(state => state.market);
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
          {t(`market.range.${item.label}_selectorLabel`)}
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
                  <Ellipsis>{t(`market.range.${value.label}_selectorLabel`)}</Ellipsis>
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

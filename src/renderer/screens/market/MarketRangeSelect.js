// @flow

import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import Ellipsis from "~/renderer/components/Ellipsis";
import { AngleDown, Check, Item, TextLink } from "~/renderer/components/Breadcrumb/common";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import Button from "~/renderer/components/Button";
import { setMarketParams } from "~/renderer/actions/market"

const MarketRangeSelect = () => {

  const onRangeSelected = useCallback(
    item => setMarketParams({ market: item.value }),
    [],
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
        items={[{
          value: "day",
          label: "24 hours",
          key: "day"
        },
          {
            value: "week",
            label: "7 days",
            key: "week"
          }]}
        renderItem={renderItem}
        onChange={onRangeSelected}
        controlled
        value={"day"}
      >
        {({ isOpen, value }) =>
          value ? (
            <Box flex={1} horizontal>
              <TextLink shrink>
                <Button>
                  <Ellipsis>{value}</Ellipsis>
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
}

export default MarketRangeSelect;

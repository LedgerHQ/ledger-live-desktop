import React, { useMemo, useCallback } from "react";
import { Flex, Button as BaseButton, Dropdown, Text, SearchInput, Icons } from "@ledgerhq/react-ui";
import { useSelector } from "react-redux";
import { starredMarketCoinsSelector } from "~/renderer/reducers/settings";
import { useTranslation } from "react-i18next";
import { useMarketData } from "./MarketDataProvider";
import styled from "styled-components";
import CounterValueSelect from "./CountervalueSelect";
import MarketList from "./MarketList";
import SideDrawerFilter from "./SideDrawerFilter";
import { rangeDataTable } from "./utils/rangeDataTable";

const Container = styled(Flex).attrs({
  flex: "1",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  overflow: "hidden",
  px: 1,
  mx: -1,
})``;

export const Button = styled(BaseButton)<{ big?: boolean }>`
  border-radius: 44px;

  ${p =>
    p.Icon
      ? `
      height: 40px;
      width: 40px;
      `
      : `
          font-size:  ${p.big ? 14 : 12}px;
          height: ${p.big ? 48 : 32}px;
          line-height: ${p.big ? 48 : 32}px;
          padding: 0 15px;
      `}

  ${p => (p.variant === "shade" ? `background-color: transparent!important;` : ``)}
`;

const Title = styled(Text).attrs({ variant: "h3" })`
  font-size: 28px;
  line-height: 33px;
`;

export default function Market() {
  const { t } = useTranslation();
  const { marketData, requestParams, refresh } = useMarketData();
  const { search, range, starred, liveCompatible } = requestParams;
  const starredMarketCoins: string[] = useSelector(starredMarketCoinsSelector);
  const starFilterOn = starred.length > 0;

  const updateSearch = useCallback(
    (value: string) => {
      refresh({ search: value, starred: [], liveCompatible: false });
    },
    [refresh],
  );

  const updateTimeRange = useCallback(
    ({ value }) => {
      refresh({ range: value });
    },
    [refresh],
  );

  const toggleFilterByStarredAccounts = useCallback(() => {
    const starred = starFilterOn ? [] : starredMarketCoins;
    refresh({ starred });
  }, [starFilterOn, starredMarketCoins]);

  const toggleLiveCompatible = useCallback(() => {
    refresh({ liveCompatible: !liveCompatible });
  }, [liveCompatible]);

  const timeRanges = useMemo(
    () => Object.keys(rangeDataTable).map(value => ({ value, label: t(`market.range.${value}`) })),
    [],
  );

  const timeRangeValue = timeRanges.find(({ value }) => value === range);

  return (
    <Container>
      <Title>{t("market.title")}</Title>
      <Flex flexDirection="row" pr="6px" my={2} alignItems="center" justifyContent="space-between">
        <SearchInput
          flex="1"
          value={search}
          onChange={updateSearch}
          placeholder={t("common.search")}
        />
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
          <CounterValueSelect />
          <Dropdown
            label={t("market.rangeLabel")}
            menuPortalTarget={document.body}
            onChange={updateTimeRange}
            options={timeRanges}
            value={timeRangeValue}
          />
          <SideDrawerFilter
            refresh={refresh}
            filters={{
              starred: {
                toggle: toggleFilterByStarredAccounts,
                value: starFilterOn,
              },
              liveCompatible: {
                toggle: toggleLiveCompatible,
                value: liveCompatible,
              },
            }}
            t={t}
          />
        </Flex>
      </Flex>
      <MarketList
        starredMarketCoins={starredMarketCoins}
        toggleStarredAccounts={toggleFilterByStarredAccounts}
      />
    </Container>
  );
}

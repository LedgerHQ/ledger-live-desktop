import React, { useMemo, useCallback } from "react";
import { Flex, Button as BaseButton, Text, SearchInput } from "@ledgerhq/react-ui";
import { useSelector } from "react-redux";
import { starredMarketCoinsSelector } from "~/renderer/reducers/settings";
import { useTranslation } from "react-i18next";
import { useMarketData } from "@ledgerhq/live-common/lib/market/MarketDataProvider";
import styled from "styled-components";
import CounterValueSelect from "./CountervalueSelect";
import MarketList from "./MarketList";
import SideDrawerFilter from "./SideDrawerFilter";
import Dropdown from "./DropDown";
import { rangeDataTable } from "@ledgerhq/live-common/lib/market/utils/rangeDataTable";
import Track from "~/renderer/analytics/Track";

const Container = styled(Flex).attrs({
  flex: "1",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  overflow: "hidden",
  px: 1,
  mx: -1,
})``;

const SearchContainer = styled(Flex).attrs({ flex: "0.8" })`
  > div {
    width: 100%;
  }
`;

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
          padding: 0 ${p.big ? 25 : 15}px;
      `}

  ${p => (p.variant === "shade" ? `background-color: transparent!important;` : ``)}
`;

const Title = styled(Text).attrs({ variant: "h3" })`
  font-size: 28px;
  line-height: 33px;
`;

export default function Market() {
  const { t } = useTranslation();
  const {
    requestParams,
    refresh,
    counterCurrency,
    setCounterCurrency,
    supportedCounterCurrencies,
  } = useMarketData();
  const { search = "", range, starred = [], liveCompatible, order } = requestParams;
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
    if (starredMarketCoins.length > 0 || starFilterOn) {
      const starred = starFilterOn ? [] : starredMarketCoins;
      refresh({ starred });
    }
  }, [refresh, starFilterOn, starredMarketCoins]);

  const toggleLiveCompatible = useCallback(() => {
    refresh({ liveCompatible: !liveCompatible });
  }, [liveCompatible, refresh]);

  const timeRanges = useMemo(
    () =>
      Object.keys(rangeDataTable)
        .filter(k => k !== "1h")
        .map(value => ({ value, label: t(`market.range.${value}`) })),
    [t],
  );

  const timeRangeValue = timeRanges.find(({ value }) => value === range);

  return (
    <Container>
      <Track
        event="Page Market"
        onMount
        onUpdate
        sort={order !== "desc"}
        timeframe={range}
        countervalue={counterCurrency}
      />
      <Title>{t("market.title")}</Title>
      <Flex flexDirection="row" pr="6px" my={2} alignItems="center" justifyContent="space-between">
        <SearchContainer>
          <SearchInput value={search} onChange={updateSearch} placeholder={t("common.search")} />
        </SearchContainer>
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
          <Flex width="290px" justifyContent="flex-end" ml={3}>
            <CounterValueSelect
              counterCurrency={counterCurrency}
              setCounterCurrency={setCounterCurrency}
              supportedCounterCurrencies={supportedCounterCurrencies}
            />
          </Flex>
          <Flex mx={3}>
            <Dropdown
              label={t("market.rangeLabel")}
              menuPortalTarget={document.body}
              onChange={updateTimeRange}
              options={timeRanges}
              value={timeRangeValue}
              searchable={false}
            />
          </Flex>
          <SideDrawerFilter
            refresh={refresh}
            filters={{
              starred: {
                toggle: toggleFilterByStarredAccounts,
                value: starFilterOn,
                disabled: !starredMarketCoins?.length,
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

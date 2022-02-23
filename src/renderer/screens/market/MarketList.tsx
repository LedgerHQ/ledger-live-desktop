import React, { useCallback, useEffect, useState, memo } from "react";
import {
  MarketDataContextType,
  useMarketData,
} from "@ledgerhq/live-common/lib/market/MarketDataProvider";
import styled from "styled-components";
import { Flex, Text, Icon } from "@ledgerhq/react-ui";
import { Trans, useTranslation } from "react-i18next";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import MarketRowItem from "./MarketRowItem";
import LoadingPlaceholder from "../../components/LoadingPlaceholder";
import NoCryptoFound from "./assets/noCryptoFound";
import { Button } from ".";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { useSelector, useDispatch } from "react-redux";
import { localeSelector } from "~/renderer/reducers/settings";
import { addStarredMarketCoins, removeStarredMarketCoins } from "~/renderer/actions/settings";
import { useProviders } from "../exchange/Swap2/Form";
import Track from "~/renderer/analytics/Track";

type Props = {
  data: MarketDataContextType;
  t: any;
};

export const TableCellBase = styled(Flex).attrs({
  alignItems: "center",
})`
  padding-left: 5px;
  padding-right: 5px;
  cursor: ${p => (p.disabled ? "default" : "pointer")};
`;

export const TableCell = ({
  loading,
  children,
  ...props
}: {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: any) => void;
  children?: React.ReactNode;
}) => (
  <TableCellBase {...props}>
    {loading ? <LoadingPlaceholder style={{ borderRadius: 50, overflow: "hidden" }} /> : children}
  </TableCellBase>
);

const ChevronContainer = styled(Flex).attrs({ m: 1 })<{
  show: boolean;
  orderDirection: string;
}>`
  opacity: ${p => (p.show ? 1 : 0)};
  svg {
    transform: rotate(
      ${p => (p.orderDirection ? (p.orderDirection === "asc" ? "180deg" : "0deg") : "90deg")}
    );
    transition: transform 0.3s ease-out;
  }
`;

export const miniChartThreshold = 1050;

export const SortTableCell = ({
  onClick,
  orderByKey,
  orderBy,
  order,
  children,
  ...props
}: {
  loading?: boolean;
  onClick?: (key: string) => void;
  orderByKey: string;
  orderBy: string;
  order: string;
  children?: React.ReactNode;
}) => (
  <TableCellBase onClick={() => !!onClick && onClick(orderByKey)} {...props}>
    {children}
    <ChevronContainer m={2} show={orderBy === orderByKey} orderDirection={order}>
      <Icon name="ChevronBottom" size={10} />
    </ChevronContainer>
  </TableCellBase>
);

const listItemHeight = 73;

export const TableRow = styled(Flex).attrs({
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "flex-start",
  height: listItemHeight,
  py: 3,
})<{ header?: boolean; disabled?: boolean }>`
  line-height: 16px;
  ${p =>
    p.header
      ? `
    color: ${p.theme.colors.neutral.c80};
    font-size: 12px;
    padding-right: 12px;
  `
      : `
    color: ${p.theme.colors.neutral.c100};
    font-size: 13px;
    border-bottom: 1px solid ${p.theme.colors.neutral.c40};

    :hover {
      background:  ${p.theme.colors.neutral.c20};
    }
    :active {
      background: ${p.theme.colors.neutral.c30};
    }
  `}
  
  cursor: ${p => (p.disabled ? "default" : "pointer")};
 
  

  ${TableCellBase}:nth-child(1) {
    flex: 0 0 40px;
    justify-content: flex-start;
    padding-left: 5px;
  }
  ${TableCellBase}:nth-child(2) {
    flex: 1 0 150px;
    justify-content: flex-start;
  }
  ${TableCellBase}:nth-child(3) {
    flex: 1 0 150px;
    justify-content: flex-end;
  }
  ${TableCellBase}:nth-child(4),
  ${TableCellBase}:nth-child(5) {
    flex: 1 0 100px;
    justify-content: flex-end;
  }
  ${TableCellBase}:nth-child(6) {
    flex: 1 0 70px;
    justify-content: flex-end;
  }
  
  ${TableCellBase}:nth-child(7) {
    flex: 0 0 40px;
    justify-content: flex-end;
    padding-right: 5px;
    svg {
      fill: currentColor;
    }
  }
`;

const NoCryptoPlaceholder = ({ requestParams, t, resetSearch }: any) => (
  <Flex
    mt={7}
    mx={"auto"}
    justifyContent="center"
    alignItems="stretch"
    width="400px"
    flexDirection="column"
  >
    <Track event="Page Market Search" success={false} />
    <Flex justifyContent="center" alignItems="center">
      <NoCryptoFound size={75} />
    </Flex>
    <Text variant="large" my={3} textAlign="center">
      {t("market.warnings.noCryptosFound")}
    </Text>
    <Text variant="paragraph" textAlign="center">
      <Trans
        i18nKey={
          requestParams.search
            ? "market.warnings.noSearchResultsFor"
            : "market.warnings.noSearchResults"
        }
        values={{ search: requestParams.search }}
      >
        <b />
      </Trans>
    </Text>
    <Button mt={3} variant="main" onClick={resetSearch} big width="100%">
      {t("market.goBack")}
    </Button>
  </Flex>
);

const CurrencyRow = memo(function CurrencyRowItem({
  data,
  index,
  counterCurrency,
  loading,
  toggleStar,
  selectCurrency,
  starredMarketCoins,
  locale,
  swapAvailableIds,
  style,
  displayChart,
}: any) {
  const currency = data ? data[index] : null;
  const isStarred = currency && starredMarketCoins.includes(currency.id);
  const availableOnBuy = currency && isCurrencySupported("BUY", currency);
  const availableOnSwap = currency && swapAvailableIds.includes(currency.id);
  return (
    <MarketRowItem
      loading={!currency || (index === data.length && index > 50 && loading)}
      currency={currency}
      counterCurrency={counterCurrency}
      isStarred={isStarred}
      toggleStar={() => toggleStar(currency.id, isStarred)}
      key={index}
      locale={locale}
      selectCurrency={selectCurrency}
      availableOnBuy={availableOnBuy}
      availableOnSwap={availableOnSwap}
      style={{ ...style }}
      displayChart={displayChart}
    />
  );
});

function MarketList({
  starredMarketCoins,
  toggleStarredAccounts,
}: {
  starredMarketCoins: string[];
  toggleStarredAccounts: () => void;
}) {
  const { t } = useTranslation();
  const locale = useSelector(localeSelector);
  const { providers, storedProviders } = useProviders();
  const swapAvailableIds =
    providers || storedProviders
      ? (providers || storedProviders)
          .map(({ pairs }) => pairs.map(({ from, to }) => [from, to]))
          .flat(2)
      : [];

  const {
    marketData,
    loading,
    endOfList,
    requestParams,
    refresh,
    loadNextPage,
    counterCurrency,
    selectCurrency,
  } = useMarketData();
  const dispatch = useDispatch();

  const { orderBy, order, starred, search } = requestParams;
  const currenciesLength = marketData.length;
  const freshLoading = loading && !currenciesLength;

  const resetSearch = useCallback(() => refresh({ search: "" }), []);

  const toggleStar = useCallback(
    (id, isStarred) => {
      if (isStarred) {
        dispatch(removeStarredMarketCoins(id));
      } else {
        dispatch(addStarredMarketCoins(id));
      }
    },
    [dispatch],
  );

  const toggleSortBy = useCallback(
    newOrderBy => {
      const isFreshSort = newOrderBy !== orderBy;
      refresh(
        isFreshSort
          ? { orderBy: newOrderBy, order: "desc" }
          : {
              orderBy: newOrderBy,
              order: order === "asc" ? "desc" : "asc",
            },
      );
    },
    [order, orderBy, refresh],
  );

  const isItemLoaded = useCallback((index: number) => !!marketData[index], [marketData]);
  const itemCount = endOfList ? currenciesLength : currenciesLength + 1;

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <Flex flex="1" flexDirection="column">
      {!currenciesLength && !loading ? (
        <NoCryptoPlaceholder requestParams={requestParams} t={t} resetSearch={resetSearch} />
      ) : (
        <>
          {search && currenciesLength > 0 && (
            <Track event="Page Market Search" onMount success={true} />
          )}
          <TableRow header>
            <SortTableCell
              onClick={toggleSortBy}
              orderByKey="market_cap"
              orderBy={orderBy}
              order={order}
            >
              #
            </SortTableCell>
            <TableCell disabled>{t("market.marketList.crypto")}</TableCell>
            <TableCell disabled>{t("market.marketList.price")}</TableCell>
            <TableCell disabled>{t("market.marketList.change")}</TableCell>
            <TableCell disabled>{t("market.marketList.marketCap")}</TableCell>
            {width > miniChartThreshold && (
              <TableCell disabled>{t("market.marketList.last7d")}</TableCell>
            )}
            <TableCell
              disabled={starredMarketCoins.length <= 0 && starred.length <= 0}
              onClick={toggleStarredAccounts}
            >
              <Icon name={starred && starred.length > 0 ? "StarSolid" : "Star"} size={18} />
            </TableCell>
          </TableRow>
          <Flex flex="1">
            <AutoSizer style={{ height: "100%", width: "100%" }}>
              {({ height }: { height: number }) =>
                freshLoading ? (
                  <List
                    height={height}
                    width="100%"
                    itemCount={Math.floor(height / listItemHeight)}
                    itemData={[]}
                    itemSize={listItemHeight}
                    style={{ overflowY: "hidden" }}
                  >
                    {props => (
                      <CurrencyRow
                        {...props}
                        counterCurrency={counterCurrency}
                        loading={loading}
                        toggleStar={toggleStar}
                        selectCurrency={selectCurrency}
                        starredMarketCoins={starredMarketCoins}
                        locale={locale}
                        swapAvailableIds={swapAvailableIds}
                      />
                    )}
                  </List>
                ) : currenciesLength ? (
                  <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={itemCount}
                    loadMoreItems={loadNextPage}
                  >
                    {({ onItemsRendered, ref }) => (
                      <List
                        height={height}
                        width="100%"
                        itemCount={itemCount}
                        onItemsRendered={onItemsRendered}
                        itemSize={listItemHeight}
                        itemData={marketData}
                        style={{ overflowX: "hidden" }}
                        ref={ref}
                        overscanCount={10}
                      >
                        {props => (
                          <CurrencyRow
                            {...props}
                            counterCurrency={counterCurrency}
                            loading={loading}
                            toggleStar={toggleStar}
                            selectCurrency={selectCurrency}
                            starredMarketCoins={starredMarketCoins}
                            locale={locale}
                            swapAvailableIds={swapAvailableIds}
                            displayChart={width > miniChartThreshold}
                          />
                        )}
                      </List>
                    )}
                  </InfiniteLoader>
                ) : (
                  <NoCryptoPlaceholder
                    requestParams={requestParams}
                    t={t}
                    resetSearch={resetSearch}
                  />
                )
              }
            </AutoSizer>
          </Flex>
        </>
      )}
    </Flex>
  );
}

export default memo(MarketList);

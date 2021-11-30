// @flow
import React, { useCallback, useContext, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import Box from "~/renderer/components/Box";
import MarketRowItem from "~/renderer/components/MarketList/MarketRowItem";
import styled from "styled-components";
import SortIcon from "./SortIcon";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useRange } from "~/renderer/hooks/market/useRange";
import { useTranslation } from "react-i18next";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import Spinner from "~/renderer/components/Spinner";
import { MarketContext } from "~/renderer/contexts/MarketContext";
import { GET_MARKET_CRYPTO_CURRENCIES } from "~/renderer/contexts/actionTypes";
import NoCryptosFound from "./NoCryptosFound";

const ListItemHeight: number = 55;

const SortIconStyled = styled(SortIcon)`
  margin: 0 5px;

  & * {
    color: ${p => p.theme.colors.palette.text.shade60};
    fill: ${p => p.theme.colors.palette.text.shade60};
  }
`;

const ListStyled = styled(List)`
  margin-top: 0;
  background: ${p => p.theme.colors.palette.background.paper};

  &::-webkit-scrollbar {
    width: 5px;
  }
`;

export const Cell: ThemedComponent<{}> = styled(Box).attrs({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  horizontal: true,
  alignItems: "center",
  fontSize: 4,
  p: 3,
})``;

const Row: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.palette.background.default};
  border: 1px solid transparent;
  box-shadow: 0 4px 8px 0 #00000007;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-weight: 600;
  justify-content: flex-start;
  position: relative;
  transition: background-color ease-in-out 200ms;
`;

export const RowContent: ThemedComponent<{
  disabled?: boolean,
}> = styled("div")`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  opacity: ${p => (p.disabled ? 0.3 : 1)};
  pointer-events: ${p => (p.disabled ? "none" : "auto")};
  cursor: ${p => (p.disabled ? "default" : "pointer")};

  ${Cell}:nth-child(1) {
    flex: 0 0 50px;
  }
  ${Cell}:nth-child(2) {
    flex: 1;
  }
  ${Cell}:nth-child(3+4) {
    flex: 0 0 150px;
    justify-content: flex-end;
  }
  ${Cell}:nth-child(5) {
    flex: 0 0 120px;
    justify-content: flex-end;
  }
`;

const HeaderRow: ThemedComponent<{
  disabled?: boolean,
}> = styled(RowContent)`
  & * {
    color: ${p => p.theme.colors.palette.text.shade60};
    fill: ${p => p.theme.colors.palette.text.shade60};
  }
`;

export const ItemRow: ThemedComponent<{
  disabled?: boolean,
}> = styled(RowContent)`
  height: 53px;

  & * {
    color: ${p => (p.disabled ? p.theme.colors.palette.text.shade100 : "auto")};
    fill: ${p => (p.disabled ? p.theme.colors.palette.text.shade100 : "auto")};
  }
`;

type CurrencyRowProps = {
  index: number,
  style: any,
};

function MarketList() {
  const { t } = useTranslation();

  const { contextState, contextDispatch } = useContext(MarketContext);
  const {
    coins,
    range,
    counterCurrency,
    order,
    orderBy,
    coinsCount,
    page,
    currencies,
    loading,
    loadingMore,
    reload,
    failedMarketParams,
    error,
    searchValue,
  } = contextState;

  const { rangeData } = useRange(range);
  const currenciesLength = currencies.length;

  useEffect(() => {
    if (!coins[0] && !loading && !error) {
      contextDispatch(GET_MARKET_CRYPTO_CURRENCIES);
    }
    if (error) {
      contextDispatch(GET_MARKET_CRYPTO_CURRENCIES, failedMarketParams);
    }
  }, [coins, contextDispatch, error, failedMarketParams, loading, reload]);

  const onSort = useCallback(
    key => {
      if (!loading) {
        if (key === orderBy) {
          contextDispatch(GET_MARKET_CRYPTO_CURRENCIES, {
            order: order === "desc" ? "asc" : "desc",
            page: 1,
          });
        } else {
          contextDispatch(GET_MARKET_CRYPTO_CURRENCIES, { orderBy: key, page: 1 });
        }
      }
    },
    [contextDispatch, loading, order, orderBy],
  );

  const loadMoreItems = useCallback(() => {
    if (!loading) {
      contextDispatch(GET_MARKET_CRYPTO_CURRENCIES, { page: page + 1, loadMore: true });
    }
  }, [contextDispatch, loading, page]);

  const isItemLoaded = useCallback((index: number) => !!currencies[index], [currencies]);
  const isLoadingPlaceholder = loading && !loadingMore;

  const CurrencyRow = useCallback(
    ({ index, style }: CurrencyRowProps) => {
      const currency = currencies[index];
      if (index === currenciesLength && loading) {
        return (
          <Box
            horizontal
            justifyContent="center"
            alignItems="center"
            key={index}
            style={{ ...style, width: "100%" }}
          >
            <Spinner size={16} />
          </Box>
        );
      }

      return (
        <MarketRowItem
          loading={isLoadingPlaceholder || !currency}
          currency={currency}
          counterCurrency={counterCurrency}
          key={index}
          style={{ ...style, pointerEvents: "auto", width: "100%" }}
        />
      );
    },
    [counterCurrency, currencies, currenciesLength, isLoadingPlaceholder, loading],
  );

  return (
    <Box id="market-list" flex="1">
      <Row expanded={true}>
        <HeaderRow disabled={!currenciesLength}>
          <Cell onClick={() => onSort("market_cap")}>
            #
            <SortIconStyled order={orderBy === "market_cap" ? order : ""} />
          </Cell>
          <Cell onClick={() => onSort("id")}>
            {t("market.marketList.name")}
            <SortIconStyled order={orderBy === "id" ? order : ""} />
          </Cell>
          <Cell onClick={() => onSort("current_price")}>{t("market.marketList.price")}</Cell>
          <Cell onClick={() => onSort(`price_change_percentage_${range}`)}>
            % {t("market.marketList.change")} ({t(`market.range.${rangeData.simple}`)})
          </Cell>
          <Cell>{t("market.marketList.marketCap")}</Cell>
        </HeaderRow>
      </Row>
      <Box flex="1">
        <AutoSizer style={{ height: "100%", width: "100%" }}>
          {({ height }) =>
            isLoadingPlaceholder ? (
              <ListStyled
                height={height}
                width="100%"
                itemCount={20}
                itemSize={ListItemHeight}
                style={{ overflowX: "hidden" }}
              >
                {CurrencyRow}
              </ListStyled>
            ) : currenciesLength ? (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={coinsCount}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <ListStyled
                    height={height}
                    width="100%"
                    itemCount={loading ? currenciesLength + 1 : currenciesLength}
                    onItemsRendered={onItemsRendered}
                    itemSize={ListItemHeight}
                    style={{ overflowX: "hidden" }}
                    ref={ref}
                  >
                    {CurrencyRow}
                  </ListStyled>
                )}
              </InfiniteLoader>
            ) : (
              <Box mt={2} justifyContent="center" horizontal>
                <NoCryptosFound searchValue={searchValue} />
              </Box>
            )
          }
        </AutoSizer>
      </Box>
    </Box>
  );
}

export default MarketList;

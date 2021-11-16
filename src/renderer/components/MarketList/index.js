// @flow
import React, { useContext, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import Box from "~/renderer/components/Box";
import MarketRowItem from "~/renderer/components/MarketList/MarketRowItem";
import styled from "styled-components";
import SortIcon from "./SortIcon";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useRange } from "~/renderer/hooks/market/useRange";
import { useTranslation } from "react-i18next";
import InfiniteLoader from "react-window-infinite-loader";
import Spinner from "~/renderer/components/Spinner";
import { MarketContext } from "~/renderer/contexts/MarketContext";
import { GET_MARKET_CRYPTO_CURRENCIES } from "~/renderer/contexts/actionTypes";

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

const ColumnTitleBox = styled(Box)`
  padding: 10px 20px;
`;

const Row: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.palette.background.default};
  border: 1px solid transparent;
  box-shadow: 0 4px 8px 0 #00000007;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex: 1;
  font-weight: 600;
  justify-content: flex-start;
  position: relative;
  transition: background-color ease-in-out 200ms;
`;

const RowContent: ThemedComponent<{
  disabled?: boolean,
}> = styled("div")`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  opacity: ${p => (p.disabled ? 0.3 : 1)};

  & * {
    color: ${p => p.theme.colors.palette.text.shade60};
    fill: ${p => p.theme.colors.palette.text.shade60};
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
    limit,
    coinsCount,
    page,
    currencies,
    loading,
    reload,
    failedMarketParams,
    error,
  } = contextState;
  const { rangeData } = useRange(range);
  const currenciesLength = currencies.length;
  console.log("contextState ", contextState);

  useEffect(() => {
    if (!coins[0] && !loading && !error) {
      contextDispatch(GET_MARKET_CRYPTO_CURRENCIES);
    }
    if (error) {
      contextDispatch(GET_MARKET_CRYPTO_CURRENCIES, failedMarketParams);
    }
  }, [coins, contextDispatch, error, failedMarketParams, loading, reload]);

  const onSort = key => {
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
  };

  const loadMoreItems = () => {
    if (!loading) {
      contextDispatch(GET_MARKET_CRYPTO_CURRENCIES, { page: page + 1, loadMore: true });
    }
  };

  const isItemLoaded = (index: number) => !!currencies[index];

  const isLoadingPlaceholder = loading && !currenciesLength;

  const CurrencyRow = ({ index, style }: CurrencyRowProps) => {
    if (index === currenciesLength && index > limit - 2 && loading) {
      return (
        <Box
          horizontal
          justifyContent="center"
          alignItems="center"
          style={{ ...style, width: "100%" }}
        >
          <Spinner size={16} />
        </Box>
      );
    }
    return (
      <MarketRowItem
        loading={isLoadingPlaceholder}
        currency={currencies[index]}
        counterCurrency={counterCurrency}
        key={index}
        style={{ ...style, pointerEvents: "auto", width: "100%" }}
      />
    );
  };

  return (
    <Box id="market-list" flow={2}>
      <Row expanded={true}>
        <RowContent>
          <ColumnTitleBox
            style={{ maxWidth: "40px" }}
            flex="5%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            alignItems="center"
            fontSize={4}
            onClick={() => onSort("market_cap")}
          >
            #
            <SortIconStyled order={orderBy === "market_cap" ? order : ""} />
          </ColumnTitleBox>
          <ColumnTitleBox
            shrink
            grow
            flex="40%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            alignItems="center"
            fontSize={4}
            onClick={() => onSort("id")}
          >
            {t("market.marketList.name")}
            <SortIconStyled order={orderBy === "id" ? order : ""} />
          </ColumnTitleBox>
          <ColumnTitleBox
            shrink
            grow
            flex="20%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            justifyContent="flex-end"
            alignItems="center"
            fontSize={4}
            onClick={() => onSort("current_price")}
          >
            {t("market.marketList.price")}
          </ColumnTitleBox>
          <ColumnTitleBox
            shrink
            grow
            flex="15%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            justifyContent="flex-end"
            alignItems="center"
            fontSize={4}
            onClick={() => onSort(`price_change_percentage_${range}`)}
          >
            % {t("market.marketList.change")} ({t(`market.range.${rangeData.simple}`)})
          </ColumnTitleBox>
          <ColumnTitleBox
            shrink
            grow
            flex="15%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            alignItems="center"
            justifyContent="flex-end"
            fontSize={4}
          >
            {t("market.marketList.marketCap")}
          </ColumnTitleBox>
        </RowContent>
      </Row>
      {isLoadingPlaceholder ? (
        <ListStyled
          height={ListItemHeight * 9}
          width="100%"
          itemCount={9}
          itemSize={ListItemHeight}
          style={{ overflowX: "hidden" }}
        >
          {CurrencyRow}
        </ListStyled>
      ) : (
        currenciesLength && (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={coinsCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <ListStyled
                height={ListItemHeight * 9}
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
        )
      )}
    </Box>
  );
}

export default MarketList;

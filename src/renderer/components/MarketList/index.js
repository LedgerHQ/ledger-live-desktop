// @flow
import React, { useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import Box from "~/renderer/components/Box";
import MarketRowItem from "~/renderer/components/MarketList/MarketRowItem";
import { useDispatch, useSelector } from "react-redux";
import { getMarketCryptoCurrencies } from "~/renderer/actions/market";
import styled from "styled-components";
import SortIcon from "./SortIcon";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import NoCryptosFound from "~/renderer/components/MarketList/NoCryptosFound";
import { useRange } from "~/renderer/hooks/market/useRange";
import Paginator from "~/renderer/components/Paginator";
import { useTranslation } from "react-i18next";
import InfiniteLoader from "react-window-infinite-loader";
import Spinner from "~/renderer/components/Spinner";

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
  const {
    range,
    searchValue,
    counterCurrency,
    order,
    orderBy,
    limit,
    coinsCount,
    page,
    currencies,
    loading,
    coins,
    reload,
    failedMarketParams
  } = useSelector(state => state.market);
  const { rangeData } = useRange(range);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currenciesLength = currencies.length;

  useEffect(() => {
    if (!coins[0]) {
      dispatch(getMarketCryptoCurrencies());
    }
  }, [coins, dispatch]);

  useEffect(() => {
    dispatch(getMarketCryptoCurrencies(failedMarketParams))
  }, [reload, dispatch]);


  const onSort = key => {
    if (!loading) {
      if (key === orderBy) {
        dispatch(getMarketCryptoCurrencies({ order: order === "desc" ? "asc" : "desc", page: 1 }));
      } else {
        dispatch(getMarketCryptoCurrencies({ orderBy: key, page: 1 }));
      }
    }
  };

  const loadMoreItems = () => {
    if (!loading) {
      dispatch(getMarketCryptoCurrencies({ page: page + 1 }));
    }
  };

  const isItemLoaded = (index: number) => !!currencies[index];

  const isLoading = loading && page === 1;
  const isLoadingMore = loading && page > 1;
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
      <Box style={{ ...style, pointerEvents: "auto", width: "100%" }}>
        <MarketRowItem
          loading={isLoading}
          currency={currencies[index]}
          counterCurrency={counterCurrency}
          key={index}
        />
      </Box>
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
      {isLoading && page === 1 ? (
        <ListStyled
          height={ListItemHeight * 9}
          width="100%"
          itemCount={9}
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
              height={currenciesLength < 9 ? currenciesLength * ListItemHeight : ListItemHeight * 9}
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
        <NoCryptosFound searchValue={searchValue} />
      )}
    </Box>
  );
}

export default MarketList;

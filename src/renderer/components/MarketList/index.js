// @flow
import React, { useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import Box from "~/renderer/components/Box";
import MarketRowItem from "~/renderer/components/MarketList/MarketRowItem";
import { connect, useDispatch, useSelector } from "react-redux";
import { getMarketCryptoCurrencies, setMarketParams } from "~/renderer/actions/market";
import styled from "styled-components";
import SortIcon from "./SortIcon";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import NoCryptosFound from "~/renderer/components/MarketList/NoCryptosFound";
import type { MarketCurrency } from "~/renderer/reducers/market";
import CryptocurrencyStar from "~/renderer/components/MarketList/CryptocurrencyStar";
import { useRange } from "~/renderer/hooks/market/useRange";
import Paginator from "~/renderer/components/Paginator";

const ListItemHeight: number = 56;

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
  background: ${p => p.theme.colors.palette.background.shade10};
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
  isSubAccountsExpanded: boolean,
}> = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  opacity: ${p => ( p.disabled ? 0.3 : 1 )};
  padding-bottom: ${p => ( p.isSubAccountsExpanded ? "20px" : "0" )};

  & * {
    color: ${p => p.theme.colors.palette.text.shade60};
    fill: ${p => p.theme.colors.palette.text.shade60};
  }
`;

type CurrencyRowProps = {
  index: number,
  style: Map<string, string>,
};

function MarketList(props) {
  const {
    range,
    searchValue,
    counterValue,
    order,
    orderBy,
    filters,
    favorites,
    counterCurrency,
    limit,
    coinsCount,
    page,
    currencies,
    loading,
  } = useSelector(state => state.market);
  const { rangeData } = useRange(range);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currencies[0]) {
      dispatch(getMarketCryptoCurrencies());
    }
  }, []);

  // for (let i = 0; i < currencies.length; i++) {
  //   const currency = currencies[i];
  //   let doSearch: boolean = true;
  //
  //   if (filters.selectedPlatforms[0] && filters.selectedPlatforms.indexOf(currency.family) < 0) {
  //     doSearch = false;
  //   }
  //   if (doSearch && matchesSearch(searchValue, currency)) {
  //     visibleCurrencies.push(currency);
  //   }
  // }

  const onSort = key => {
    if (!loading) {
      if (key === orderBy) {
        dispatch(getMarketCryptoCurrencies({ order: order === "desc" ? "asc" : "desc" }));
      } else {
        dispatch(getMarketCryptoCurrencies({ orderBy: key }));
      }
    }
  };

  // visibleCurrencies = sortCurrencies(visibleCurrencies, orderBy, order);

  const CurrencyRow = ({ index, style }: CurrencyRowProps) => (
    <MarketRowItem
      loading={loading}
      currency={currencies[index]}
      index={index + 1}
      counterValueCurrency={counterValue.currency}
      style={{ ...style, pointerEvents: "auto" }}
      rangeData={rangeData}
      key={index}
    />
  );

  const currenciesLength = loading ? limit : currencies.length;

  return (
    <Box flow={2}>
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
            Name
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
            Price
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
            % Change
          </ColumnTitleBox>
          <ColumnTitleBox
            shrink
            grow
            flex="14%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            alignItems="center"
            justifyContent="flex-start"
            fontSize={4}
          >
            Variation
          </ColumnTitleBox>
          <ColumnTitleBox
            shrink
            flex="1%"
            ff="Inter|SemiBold"
            color="palette.text.shade100"
            horizontal
            alignItems="center"
            justifyContent="flex-end"
            fontSize={4}
            onClick={() => onSort("isStarred")}
            mr={1}
          >
            <CryptocurrencyStar
              isStarred={orderBy === "isStarred" && order === "desc"}
              disableAnimation
            />
          </ColumnTitleBox>
        </RowContent>
      </Row>
      {currenciesLength ? (
        <ListStyled
          height={currenciesLength < 9 ? currenciesLength * ListItemHeight : ListItemHeight * 9}
          width="100%"
          itemCount={currenciesLength}
          itemSize={ListItemHeight}
          key={range}
          style={{ overflowX: "hidden" }}
        >
          {CurrencyRow}
        </ListStyled>
      ) : (
        <NoCryptosFound searchValue={searchValue} />
      )}
      {!searchValue && (
        <Box justifyContent="center" horizontal>
          <Paginator
            currentPage={page}
            loading={loading}
            totalSize={coinsCount}
            limit={limit}
            small
            onChange={page => dispatch(getMarketCryptoCurrencies({ page }))}
          />
        </Box>
      )}
    </Box>
  );
}

export default connect(null, { getMarketCryptoCurrencies })(MarketList);

const sortCurrencies = (currencies, key, order) => {
  if (typeof currencies[key] === "string") {
    currencies[key] = currencies[key].toLowerCase();
  }
  if (typeof currencies[key] === "boolean") {
    currencies[key] += false;
  }
  return currencies.sort(function(a, b) {
    const orders = {
      asc: (a, b) => ( a > b ? 1 : -1 ),
      desc: (a, b) => ( a < b ? 1 : -1 )
    };
    return orders[order](a[key], b[key]);
  });
};

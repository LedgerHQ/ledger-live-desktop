// @flow
import React, { Component } from "react";
import { connect, useSelector } from "react-redux";
import styled from "styled-components";
import debounce from "lodash/debounce";

import Box from "~/renderer/components/Box";
import SearchBox from "~/renderer/screens/accounts/AccountList/SearchBox";
import MarketHeader from "~/renderer/screens/market/MarketHeader";
import MarketList from "~/renderer/components/MarketList";
import { setMarketParams, getMarketCryptoCurrencies } from "~/renderer/actions/market";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { MarketState } from "~/renderer/reducers/market";
import Paginator from "~/renderer/components/Paginator";

type Props = {
  getMarketCryptoCurrencies: (
    state: $Shape<MarketState>,
  ) => { payload: $Shape<MarketState>, type: string },
  setMarketParams: (state: $Shape<MarketState>) => { payload: $Shape<MarketState>, type: string },
  searchValue: string,
  limit: number,
  coinsCount: number,
  page: number,
  loading: boolean,
};

const ShadowContainer = styled(Box)`
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 3%);
  border-radius: 4px;
  overflow: hidden;
`;

class MarketPage extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.debouncedSearch = debounce(this.debouncedSearch, 1000);
  }

  debouncedSearch = () => {
    this.props.getMarketCryptoCurrencies({ page: 1 });
  };

  onTextChange = (value: string) => {
    const searchValue = value.trim();
    this.props.setMarketParams({ searchValue: searchValue, loading: true });

    // check for not allowing search with 1 letter because of fetch error in coingecko side
    if (searchValue.length !== 0 && searchValue.length < 2) {
      return;
    }
    this.debouncedSearch();
  };

  render() {
    const { searchValue, limit, coinsCount, page, loading, getMarketCryptoCurrencies } = this.props;
    return (
      <Box>
        <MarketHeader />
        <ShadowContainer>
          <SearchContainer horizontal p={0} alignItems="center">
            <SearchBox
              id={"market-search-input"}
              autoFocus
              onTextChange={e => this.onTextChange(e.target.value)}
              search={searchValue}
            />
          </SearchContainer>
          <MarketList />
        </ShadowContainer>
        <Box mt={2} justifyContent="center" horizontal>
          <Paginator
            currentPage={page}
            loading={loading}
            totalSize={coinsCount}
            limit={limit}
            small
            onChange={page => getMarketCryptoCurrencies({ page })}
          />
        </Box>
      </Box>
    );
  }
}

const SearchContainer: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.palette.background.paper};
  flex: 1;
  padding: 15px 20px;
  margin-bottom: 2px;
  color: #abadb6;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  border-radius: 4px 4px 0 0;
  min-height: 52px;
`;

export default connect<*, *, *, *, *, *>(state => ({ ...state.market }), {
  getMarketCryptoCurrencies,
  setMarketParams,
})(MarketPage);

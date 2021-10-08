// @flow
import React, { Component, useCallback, useState } from "react";
import { compose } from "redux";
import { connect, useDispatch, useSelector } from "react-redux";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";

import Box from "~/renderer/components/Box";
import SearchBox from "~/renderer/screens/accounts/AccountList/SearchBox";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import MarketHeader from "~/renderer/screens/market/MarketHeader";
import MarketList from "~/renderer/components/MarketList";
import { setMarketParams, getMarketCryptoCurrencies } from "~/renderer/actions/market";
import debounce from "lodash/debounce";

type Props = {
  getMarketCryptoCurrencies: any,
  setMarketParams: any,
};

class MarketPage extends Component {
  constructor() {
    super();
    this.debouncedSearch = debounce(this.debouncedSearch, 1000);
  }

  debouncedSearch = () => {
    this.props.getMarketCryptoCurrencies();
  };

  onTextChange = e => {
    this.props.setMarketParams({ searchValue: e.target.value, loading: true });
    this.debouncedSearch();
  };

  render() {
    const { searchValue } = this.props
    return (
      <Box>
        <MarketHeader />
        <SearchContainer horizontal p={0} alignItems="center">
          <SearchBox
            id={"market-search-input"}
            autoFocus
            onTextChange={this.onTextChange}
            search={searchValue}
          />
        </SearchContainer>
        <MarketList />
      </Box>
    );
  }
}

// const MarketPage = ({ getMarketCryptoCurrencies, setMarketParams }: Props) => {
//   const { searchValue } = useSelector(state => state.market);
//
//   const debouncedSearch = debounce(() => {
//     getMarketCryptoCurrencies();
//   }, 1500);
//
//   const onTextChange = e => {
//     // setMarketParams({ searchValue: e.target.value, loading: true });e
//     setSearch(e.target.value);
//     debouncedSearch();
//   };
//
//   return (
//     <Box>
//       <MarketHeader />
//       <SearchContainer horizontal p={0} alignItems="center">
//         <SearchBox
//           id={"market-search-input"}
//           autoFocus
//           onTextChange={onTextChange}
//           search={search}
//         />
//       </SearchContainer>
//       <MarketList />
//     </Box>
//   );
// };

const SearchContainer: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.palette.background.paper};
  flex: 1;
  padding: 10px 20px;
  margin-bottom: 2px;
  color: #abadb6;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  border-radius: 4px 4px 0 0;
`;

export default connect(state => ({ ...state.market }), {
  getMarketCryptoCurrencies,
  setMarketParams,
})(MarketPage);

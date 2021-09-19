// @flow

import React, { useCallback } from "react";
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
import { setMarketParams } from "~/renderer/actions/market";

type Props = {
  t: TFunction,
};

const MarketPage = ({ t }: Props) => {
  const { searchValue } = useSelector(state => state.market);
  const dispatch = useDispatch();
  const onTextChange = useCallback(
    (evt: SyntheticInputEvent<HTMLInputElement>) =>
      dispatch(setMarketParams({ searchValue: evt.target.value })),
    [searchValue],
  );

  return (
    <Box>
      <MarketHeader />
      <SearchContainer horizontal p={0} alignItems="center">
        <SearchBox
          id={"market-search-input"}
          autoFocus
          onTextChange={onTextChange}
          search={searchValue}
        />
      </SearchContainer>
      <MarketList />
    </Box>
  );
};

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

const ConnectedMarketPage: React$ComponentType<{}> = compose(
  connect(),
  withTranslation(),
)(MarketPage);

export default ConnectedMarketPage;

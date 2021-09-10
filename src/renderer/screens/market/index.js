// @flow

import React, { useCallback, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import type { TFunction } from "react-i18next";
import { withTranslation } from "react-i18next";

import Box from "~/renderer/components/Box";
import SearchBox from "~/renderer/screens/accounts/AccountList/SearchBox";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import MarketHeader from "~/renderer/screens/market/MarketHeader";
import MarketList from "~/renderer/components/MarketList";

type Props = {
  t: TFunction,
};

const MarketPage = ({ t, collapsable }: Props) => {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(collapsable);
  const onTextChange = useCallback(
    (evt: SyntheticInputEvent<HTMLInputElement>, v) => setQuery(evt.target.value),
    [setQuery],
  );

  return (
    <Box>
      <MarketHeader />
      <SearchContainer horizontal p={0} alignItems="center">
        <SearchBox
          id={"market-search-input"}
          autoFocus
          onTextChange={onTextChange}
          search={query}
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
  margin-bottom: 9px;
  color: #abadb6;
  font-weight: 600;
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 #00000007;
`;

const ConnectedMarketPage: React$ComponentType<{}> = compose(
  connect(),
  withTranslation(),
)(MarketPage);

export default ConnectedMarketPage;

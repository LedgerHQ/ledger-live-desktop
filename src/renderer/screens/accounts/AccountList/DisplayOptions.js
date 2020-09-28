// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { setAccountsViewMode, setSelectedTimeRange } from "~/renderer/actions/settings";
import { accountsViewModeSelector, selectedTimeRangeSelector } from "~/renderer/reducers/settings";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import GridIcon from "~/renderer/icons/Grid";
import ListIcon from "~/renderer/icons/List";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import AccountsOrder from "./Order";
import AccountsRange from "./Range";

function DisplayOptions() {
  const dispatch = useDispatch();
  const mode = useSelector(accountsViewModeSelector);
  const range = useSelector(selectedTimeRangeSelector);

  return (
    <>
      <AccountsRange onRangeChange={val => dispatch(setSelectedTimeRange(val))} range={range} />
      <Box ml={4} mr={4}>
        <AccountsOrder />
      </Box>
      <ToggleButton
        event="Account view table"
        mr={1}
        onClick={() => dispatch(setAccountsViewMode("list"))}
        active={mode === "list"}
      >
        <ListIcon />
      </ToggleButton>
      <ToggleButton
        event="Account view mosaic"
        onClick={() => dispatch(setAccountsViewMode("card"))}
        active={mode === "card"}
      >
        <GridIcon />
      </ToggleButton>
    </>
  );
}

export default React.memo<{}>(DisplayOptions);

const ToggleButton: ThemedComponent<{ active?: boolean }> = styled(Button)`
  height: 30px;
  width: 30px;
  padding: 7px;
  background: ${p =>
    p.active ? p.theme.colors.pillActiveBackground : p.theme.colors.palette.background.paper};
  color: ${p => (p.active ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
`;

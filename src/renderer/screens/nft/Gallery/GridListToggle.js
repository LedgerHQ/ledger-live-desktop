// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Card } from "~/renderer/components/Box";
import { useDispatch, useSelector } from "react-redux";
import { nftsViewModeSelector } from "~/renderer/reducers/settings";
import { setNftsViewMode } from "~/renderer/actions/settings";
import Button from "~/renderer/components/Button";
import GridIcon from "~/renderer/icons/Grid";
import ListIcon from "~/renderer/icons/List";

const ToggleButton: ThemedComponent<{ active?: boolean }> = styled(Button)`
  height: 30px;
  width: 30px;
  padding: 7px;
  background: ${p =>
    p.active ? p.theme.colors.pillActiveBackground : p.theme.colors.palette.background.paper};
  color: ${p => (p.active ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
`;

const GridListToggle = () => {
  const dispatch = useDispatch();
  const nftsViewMode = useSelector(nftsViewModeSelector);

  const setListMode = useCallback(() => dispatch(setNftsViewMode("list")), [dispatch]);
  const setGridMode = useCallback(() => dispatch(setNftsViewMode("grid")), [dispatch]);

  return (
    <Card horizontal justifyContent="flex-end" p={3} mb={3}>
      <ToggleButton mr={1} active={nftsViewMode === "list"} onClick={setListMode}>
        <ListIcon />
      </ToggleButton>
      <ToggleButton active={nftsViewMode === "grid"} onClick={setGridMode}>
        <GridIcon />
      </ToggleButton>
    </Card>
  );
};

export default GridListToggle;

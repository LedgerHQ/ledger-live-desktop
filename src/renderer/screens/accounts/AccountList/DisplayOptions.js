// @flow

import React from "react";
import styled from "styled-components";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/types/portfolio";

import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import GridIcon from "~/renderer/icons/Grid";
import ListIcon from "~/renderer/icons/List";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import AccountsOrder from "./Order";
import AccountsRange from "./Range";

type Props = {
  onModeChange: (*) => void,
  onRangeChange: PortfolioRange => void,
  mode: string,
  range?: PortfolioRange,
};

const ToggleButton: ThemedComponent<{ active?: boolean }> = styled(Button)`
  height: 30px;
  width: 30px;
  padding: 7px;
  background: ${p =>
    p.active ? p.theme.colors.pillActiveBackground : p.theme.colors.palette.background.paper};
  color: ${p => (p.active ? p.theme.colors.wallet : p.theme.colors.palette.divider)};
`;

const DisplayOptions = ({ onModeChange, onRangeChange, mode, range }: Props) => (
  <>
    <AccountsRange onRangeChange={onRangeChange} range={range} />
    <Box ml={4} mr={4}>
      <AccountsOrder />
    </Box>
    <ToggleButton mr={1} onClick={() => onModeChange("list")} active={mode === "list"}>
      <ListIcon />
    </ToggleButton>
    <ToggleButton onClick={() => onModeChange("card")} active={mode === "card"}>
      <GridIcon />
    </ToggleButton>
  </>
);

export default React.memo<Props>(DisplayOptions);

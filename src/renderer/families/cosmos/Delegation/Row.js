// @flow

import React from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { BigNumber } from "bignumber.js";
import type { Unit } from "@ledgerhq/live-common/lib/types";

import FormattedVal from "~/renderer/components/FormattedVal";
import Ellipsis from "~/renderer/components/Ellipsis";

import { TableLine } from "./Header";
import Discreet from "~/renderer/components/Discreet";

const Wrapper: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
`;

const Column: ThemedComponent<{ clickable?: boolean }> = styled(TableLine).attrs(p => ({
  ff: "Inter|SemiBold",
  color: p.strong ? "palette.text.shade100" : "palette.text.shade80",
  fontSize: 3,
}))`
  cursor: ${p => (p.clickable ? "pointer" : "cursor")};
`;

type Props = {
  validator: *,
  address: string,
  amount: React$Node,
  distribution: number,
  pendingRewards: BigNumber,
  unit: Unit,
};

const Row = ({ validator, address, amount, distribution, pendingRewards, unit }: Props) => {
  return (
    <Wrapper>
      <Column strong>
        <Ellipsis>{validator ? validator.name : address}</Ellipsis>
      </Column>
      <Column>
        <Discreet>{amount}</Discreet>
      </Column>
      <Column>{(distribution * 100).toFixed(2)}%</Column>
      <Column>{validator ? validator.status : "–"}%</Column>
      <Column>
        <FormattedVal val={pendingRewards} unit={unit} showCode />
      </Column>
    </Wrapper>
  );
};

export default Row;

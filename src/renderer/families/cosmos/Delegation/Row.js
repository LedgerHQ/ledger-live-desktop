// @flow

import React from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

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
};

const Row = ({ validator, address, amount, distribution }: Props) => {
  return (
    <Wrapper>
      <Column strong>
        <Ellipsis>{validator ? validator.name : address}</Ellipsis>
      </Column>
      <Column>
        <Discreet>{amount}</Discreet>
      </Column>
      <Column>{distribution}%</Column>
      <Column>{validator ? validator.status : "–"}%</Column>
    </Wrapper>
  );
};

export default Row;

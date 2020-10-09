// @flow

import React from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

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
  amountRedeemed: string,
  interestEarned: string,
  date: string,
};

const Row = ({ amountRedeemed, interestEarned, date }: Props) => {
  return (
    <Wrapper>
      <Column>
        <Discreet>{amountRedeemed}</Discreet>
      </Column>
      <Column>
        <Discreet>{interestEarned}</Discreet>
      </Column>
      <Column>{date}</Column>
    </Wrapper>
  );
};

export default Row;

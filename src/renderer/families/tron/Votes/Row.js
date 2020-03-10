// @flow

import React, { useCallback } from "react";
import styled from "styled-components";

import { openURL } from "~/renderer/linking";
import Ellipsis from "~/renderer/components/Ellipsis";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { TableLine } from "./Header";

const Wrapper: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
`;

const Column: ThemedComponent<{ clickable?: boolean }> = styled(TableLine).attrs(() => ({
  ff: "Inter|Bold",
  color: "palette.text.shade70",
  fontSize: 4,
}))`
  cursor: ${p => (p.clickable ? "pointer" : "cursor")};
`;

type Props = {
  validator: *,
  address: string,
  amount: number,
  duration: string,
  percentTP: string,
  currency: *,
};

const Row = ({ validator, address, amount, duration, percentTP, currency }: Props) => {
  const srURL = validator && validator.url;

  const openSR = useCallback(() => {
    if (srURL) openURL(srURL);
  }, [srURL]);

  return (
    <Wrapper>
      <Column clickable onClick={openSR}>
        <Ellipsis>{validator ? validator.name : address}</Ellipsis>
      </Column>
      <Column>TP {amount}</Column>
      <Column>{duration}</Column>
      <Column>{percentTP}%</Column>
    </Wrapper>
  );
};

export default Row;

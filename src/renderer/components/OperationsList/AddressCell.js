// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const MIN_ADDRESS_LENGTH_TO_SPLIT = 24;

export const SplitAddress = ({
  value,
  style,
}: {
  value: string,
  style?: {
    color?: string,
    ff?: string,
    fontSize?: number,
  },
}) => {
  if (!value) {
    return <Box />;
  }

  const third = Math.round(value.length / 3);

  // FIXME why not using CSS for this? meaning we might be able to have a left & right which both take 50% & play with overflow & text-align
  const left = value.slice(0, third);
  const right = value.slice(third, value.length);

  return (
    <Box horizontal {...style}>
      <Left>{left}</Left>
      <Right>{right}</Right>
    </Box>
  );
};

export const Address = ({ value }: { value: string }) => {
  const style = {
    color: "palette.text.shade80",
    ff: "Inter",
    fontSize: "3",
  };

  return value.length > MIN_ADDRESS_LENGTH_TO_SPLIT ? (
    <SplitAddress value={value} style={style} />
  ) : (
    <Box horizontal {...style}>
      {value}
    </Box>
  );
};

const Left: ThemedComponent<{}> = styled.div`
  overflow: hidden;
  white-space: nowrap;
  font-kerning: none;
  letter-spacing: 0px;
`;

const Right: ThemedComponent<{}> = styled.div`
  display: inline-block;
  flex-shrink: 1;
  direction: rtl;
  text-indent: 0.6ex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-kerning: none;
  min-width: 6ex;
  letter-spacing: 0px;
`;

export const Cell: ThemedComponent<{ px?: number }> = styled(Box).attrs(p => ({
  px: p.px === 0 ? p.px : p.px || 4,
  horizontal: true,
  alignItems: "center",
}))`
  width: 150px;
  flex-grow: 1;
  flex-shrink: 1;
  display: block;
`;

type Props = {
  operation: Operation,
};

class AddressCell extends PureComponent<Props> {
  render() {
    const { operation } = this.props;

    const value =
      operation.type === "IN" || operation.type === "REVEAL" || operation.type === "REWARD_PAYOUT"
        ? operation.senders[0]
        : operation.recipients[0];

    return value ? (
      <Cell>
        <Address value={value} />
      </Cell>
    ) : (
      <Box flex={1} />
    );
  }
}

export default AddressCell;

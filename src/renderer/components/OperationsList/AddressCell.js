// @flow

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import getENSReverseLookup from "./getENSReverseLookup";

export const SplitAddress = ({
  value,
  color,
  ff,
  fontSize,
}: {
  value: string,
  color?: string,
  ff?: string,
  fontSize?: number,
}) => {
  if (!value) {
    return <Box />;
  }

  const boxProps = {
    color,
    ff,
    fontSize,
  };

  const third = Math.round(value.length / 3);

  // FIXME why not using CSS for this? meaning we might be able to have a left & right which both take 50% & play with overflow & text-align
  const left = value.slice(0, third);
  const right = value.slice(third, value.length);

  return (
    <Box horizontal {...boxProps}>
      <Left>{left}</Left>
      <Right>{right}</Right>
    </Box>
  );
};

export const Address = ({ value }: { value: string }) => (
  <SplitAddress value={value} color="palette.text.shade80" ff="Inter" fontSize={3} />
);

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
  min-width: 3ex;
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
  display: flex;
  column-gap: 8px;
  justify-content: center;
`;

const Tag = styled.div`
  display: inline-flex;
  background-color: ${p => p.theme.colors.blueTransparentBackground};
  border-radius: 8px;
  padding: 4px 10px;
`;

type Props = { operation: Operation };

const AddressCell = ({ operation }: Props) => {
  const [ens, setEns] = useState<?string>(null);

  const address =
    operation.type === "IN" || operation.type === "REVEAL" || operation.type === "REWARD_PAYOUT"
      ? operation.senders[0]
      : operation.recipients[0];

  useEffect(() => {
    const fetchENS = async () => {
      const ens = await getENSReverseLookup(address);
      console.log({ address, ens });
      if (ens) setEns(ens);
    };

    fetchENS();
  }, []);

  return address ? (
    <Cell>
      <Address value={address} />
      {ens ? <Tag>{ens}</Tag> : null}
    </Cell>
  ) : (
    <Box flex={1} />
  );
};

export default React.memo(AddressCell);

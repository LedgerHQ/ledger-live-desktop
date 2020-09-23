// @flow
import React from "react";
import type { OpenedLoanStatus } from "@ledgerhq/live-common/lib/compound/types";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const colorMap = {
  ENABLING: {
    background: "palette.text.shade10",
    text: "palette.text.shade80",
  },
  TO_SUPPLY: {
    background: "blueTransparentBackground",
    text: "wallet",
  },
  SUPPLYING: {
    background: "wallet",
    text: "white",
  },
  SUPPLIED: {
    background: "wallet",
    text: "white",
  },
};

const Wrapper: ThemedComponent<{}> = styled(Box)`
  padding: 4px 8px;
  border-radius: 64px;
`;

type Props = {
  type: OpenedLoanStatus,
};

const Pill = ({ type }: Props) => {
  const { background, text } = colorMap[type];

  return (
    <Wrapper backgroundColor={background}>
      <Text ff="Inter|Bold" color={text} fontSize={2}>
        {type.toUpperCase()}
      </Text>
    </Wrapper>
  );
};

export default Pill;

import React from "react";
import { BigNumber } from "bignumber.js";
import { Unit } from "@ledgerhq/live-common/lib/types";
import { Flex, Text } from "@ledgerhq/react-ui";

import FormattedVal from "~/renderer/components/FormattedVal";
import { useTheme } from "styled-components";

type Props = {
  unit: Unit;
  balance: BigNumber;
  disableRounding?: boolean;
};

const Balance: React.FC<Props> = (props: Props) => {
  const theme = useTheme();
  const { unit, balance, disableRounding } = props;
  return (
    <Flex flex="30%" flexDirection="row" alignItems="center" justifyContent="flex-start">
      <Text variant="paragraph" fontWeight="medium">
        <FormattedVal
          alwaysShowSign={false}
          animateTicker={false}
          ellipsis
          color={theme.colors.palette.neutral.c80}
          unit={unit}
          showCode
          val={balance}
          disableRounding={disableRounding}
        />
      </Text>
    </Flex>
  );
};

export default Balance;

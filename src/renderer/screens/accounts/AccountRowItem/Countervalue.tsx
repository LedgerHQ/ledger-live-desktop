import React from "react";
import { AccountLike, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { Text } from "@ledgerhq/react-ui";
import { useBalanceHistoryWithCountervalue } from "~/renderer/actions/portfolio";
import Box from "~/renderer/components/Box";
import CounterValue from "~/renderer/components/CounterValue";
import { useTheme } from "styled-components";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";

type Props = {
  account: AccountLike;
  range: PortfolioRange;
  currency: CryptoCurrency | TokenCurrency;
};
export default function Countervalue({ account, range, currency }: Props) {
  const histo = useBalanceHistoryWithCountervalue({ account, range });
  const balanceEnd = histo.history[histo.history.length - 1].value;
  const theme = useTheme();
  const placeholder = (
    <Text variant="paragraph" fontWeight="semiBold">
      -
    </Text>
  );
  return (
    <FlexBox justifyContent="flex-end" flex="20%">
      <Text variant="paragraph" fontWeight="semiBold">
        {histo.countervalueAvailable ? (
          <CounterValue
            currency={currency}
            value={balanceEnd}
            animateTicker={false}
            showCode
            color={theme.colors.palette.neutral.c100}
            placeholder={placeholder}
          />
        ) : (
          placeholder
        )}
      </Text>
    </FlexBox>
  );
}

// @flow

import React from "react";
import type {
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
  PortfolioRange,
} from "@ledgerhq/live-common/lib/types";
import { useBalanceHistoryWithCountervalue } from "~/renderer/actions/portfolio";
import Box from "~/renderer/components/Box";
import CounterValue from "~/renderer/components/CounterValue";
import { PlaceholderLine } from "~/renderer/components/Placeholder";

type Props = {
  account: AccountLike,
  range: PortfolioRange,
  currency: CryptoCurrency | TokenCurrency,
};
export default function Countervalue({ account, range, currency }: Props) {
  const histo = useBalanceHistoryWithCountervalue({ account, range });
  const balanceEnd = histo.history[histo.history.length - 1].value;
  const placeholder = <PlaceholderLine width={16} height={2} />;

  return (
    <Box flex="20%">
      {histo.countervalueAvailable ? (
        <CounterValue
          currency={currency}
          value={balanceEnd}
          animateTicker={false}
          showCode
          fontSize={3}
          color="palette.text.shade80"
          placeholder={placeholder}
        />
      ) : (
        placeholder
      )}
    </Box>
  );
}

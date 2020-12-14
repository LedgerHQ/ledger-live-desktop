// @flow
import React from "react";
import type { AccountLike, PortfolioRange } from "@ledgerhq/live-common/lib/types";
import { useBalanceHistoryWithCountervalue } from "~/renderer/actions/portfolio";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import { PlaceholderLine } from "~/renderer/components/Placeholder";

type Props = {
  account: AccountLike,
  range: PortfolioRange,
};

export default function Delta({ account, range }: Props) {
  const { countervalueChange } = useBalanceHistoryWithCountervalue({ account, range });
  return (
    <Box flex="10%" justifyContent="flex-end">
      {!countervalueChange.percentage ? (
        <PlaceholderLine width={16} height={2} />
      ) : (
        <FormattedVal
          isPercent
          val={countervalueChange.percentage.times(100).integerValue()}
          alwaysShowSign
          fontSize={3}
        />
      )}
    </Box>
  );
}

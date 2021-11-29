import React from "react";
import { AccountLike } from "@ledgerhq/live-common/lib/types";
import { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { Flex, Text } from "@ledgerhq/react-ui";
import { useBalanceHistoryWithCountervalue } from "~/renderer/actions/portfolio";
import FormattedVal from "~/renderer/components/FormattedVal";
type Props = {
  account: AccountLike;
  range: PortfolioRange;
};

export default function Delta({ account, range }: Props) {
  const { countervalueChange } = useBalanceHistoryWithCountervalue({ account, range });
  const placeholder = (
    <Text variant="paragraph" fontWeight="semiBold">
      -
    </Text>
  );
  return (
    <Flex justifyContent="flex-end" flex="20%">
      <Text variant="paragraph" fontWeight="medium">
        {!countervalueChange.percentage ? (
          placeholder
        ) : (
          <FormattedVal
            isPercent
            val={Math.round(countervalueChange.percentage * 100)}
            alwaysShowSign
          />
        )}
      </Text>
    </Flex>
  );
}

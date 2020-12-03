// @flow

import React from "react";
import styled from "styled-components";
import { useBalanceHistoryWithCountervalue } from "~/renderer/actions/portfolio";
import type { Account, TokenAccount, PortfolioRange } from "@ledgerhq/live-common/lib/types";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";
import Chart from "~/renderer/components/ChartPreview";
import useTheme from "~/renderer/hooks/useTheme";

const Placeholder = styled.div`
  height: 14px;
`;

type Props = {
  account: Account | TokenAccount,
  range: PortfolioRange,
};

function Body({ account, range }: Props) {
  const { history, countervalueAvailable, countervalueChange } = useBalanceHistoryWithCountervalue({
    account,
    range,
  });
  const bgColor = useTheme("colors.palette.background.paper");
  const currency = getAccountCurrency(account);

  return (
    <Box flow={4}>
      <Box flow={2} horizontal>
        <Box justifyContent="center">
          <CounterValue
            currency={currency}
            value={history[history.length - 1].value}
            animateTicker={false}
            showCode
            fontSize={3}
            placeholder={<Placeholder />}
            color="palette.text.shade80"
          />
        </Box>
        <Box grow justifyContent="center">
          {!countervalueChange.percentage ? null : (
            <FormattedVal
              isPercent
              val={countervalueChange.percentage.times(100).integerValue()}
              alwaysShowSign
              fontSize={3}
            />
          )}
        </Box>
      </Box>
      <Chart
        data={history}
        color={getCurrencyColor(currency, bgColor)}
        valueKey={countervalueAvailable ? "countervalue" : "value"}
        height={52}
      />
    </Box>
  );
}

const MemoedBody: React$ComponentType<Props> = React.memo(Body);

export default MemoedBody;

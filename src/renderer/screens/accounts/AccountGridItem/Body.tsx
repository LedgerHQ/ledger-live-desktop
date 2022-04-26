import React from "react";
import { useBalanceHistoryWithCountervalue } from "~/renderer/actions/portfolio";
import { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { Chart, Flex, Text } from "@ledgerhq/react-ui";
import { useCurrencyColor } from "~/renderer/getCurrencyColor";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";
import OldChart from "~/renderer/components/ChartPreview";
import useTheme from "~/renderer/hooks/useTheme";

type Props = {
  account: Account | TokenAccount;
  range: PortfolioRange;
};

function Body({ account, range }: Props) {
  const { history, countervalueAvailable, countervalueChange } = useBalanceHistoryWithCountervalue({
    account,
    range,
  });
  const {
    colors: { palette },
  } = useTheme();
  const bgColor = palette.neutral.c00;
  const currency = getAccountCurrency(account);
  const color = useCurrencyColor(currency, bgColor);

  const counterValueColor = palette.neutral.c70;

  return (
    <Flex flexDirection="column" mt={3} rowGap={6}>
      <Flex flexDirection="row" columnGap="6px">
        <Flex>
          <Text variant="paragraph" fontWeight="medium">
            <CounterValue
              currency={currency}
              value={history[history.length - 1].value}
              animateTicker={false}
              showCode
              color={counterValueColor}
            />
          </Text>
        </Flex>
        {!countervalueChange.percentage ? null : (
          <Text variant="paragraph" fontWeight="medium">
            <FormattedVal
              isPercent
              val={Math.round(countervalueChange.percentage * 100)}
              alwaysShowSign
            />
          </Text>
        )}
      </Flex>
      <div>
        <Chart
          // $FlowFixMe TODO make date non optional
          variant="small"
          data={history}
          color={color}
          valueKey={countervalueAvailable ? "countervalue" : "value"}
          height={86}
        />
      </div>
    </Flex>
  );
}

const MemoedBody: React$ComponentType<Props> = React.memo(Body);

export default MemoedBody;

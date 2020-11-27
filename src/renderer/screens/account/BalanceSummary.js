// @flow

import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useBalanceHistoryWithCountervalue } from "~/renderer/actions/portfolio";
import { BigNumber } from "bignumber.js";
import moment from "moment";
import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import type {
  Currency,
  Account,
  AccountLike,
  PortfolioRange,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import Chart from "~/renderer/components/Chart";
import Box, { Card } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import AccountBalanceSummaryHeader from "./AccountBalanceSummaryHeader";
import { discreetModeSelector } from "~/renderer/reducers/settings";

import AccountLendingFooter from "~/renderer/screens/lend/Account/AccountBalanceSummaryFooter";

import perFamilyAccountBalanceSummaryFooter from "~/renderer/generated/AccountBalanceSummaryFooter";

type Props = {
  counterValue: Currency,
  chartColor: string,
  account: AccountLike,
  parentAccount: ?Account,
  range: PortfolioRange,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
  mainAccount: ?Account,
  isCompoundEnabled?: boolean,
  ctoken: ?TokenCurrency,
};

export default function AccountBalanceSummary({
  account,
  counterValue,
  countervalueFirst,
  range,
  chartColor,
  setCountervalueFirst,
  mainAccount,
  isCompoundEnabled,
  parentAccount,
  ctoken,
}: Props) {
  const {
    history,
    countervalueAvailable,
    countervalueChange,
    cryptoChange,
  } = useBalanceHistoryWithCountervalue({ account, range });
  const discreetMode = useSelector(discreetModeSelector);

  const renderTooltip = useCallback(
    (d: any) => {
      const displayCountervalue = countervalueFirst && countervalueAvailable;
      const unit = getAccountUnit(account);
      const data = [
        { val: d.value, unit },
        { val: d.countervalue, unit: counterValue.units[0] },
      ];
      if (displayCountervalue) data.reverse();
      return (
        <>
          <FormattedVal fontSize={5} color="palette.text.shade100" showCode {...data[0]} />
          {countervalueAvailable ? (
            <FormattedVal fontSize={4} color="warmGrey" showCode {...data[1]} />
          ) : null}
          <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3} mt={2}>
            {moment(d.date).format("LL")}
          </Box>
          <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
            {moment(d.date).format("LT")}
          </Box>
        </>
      );
    },
    [account, counterValue.units, countervalueAvailable, countervalueFirst],
  );

  const renderTickYCryptoValue = useCallback(
    (val: any) => {
      const unit = getAccountUnit(account);
      return formatShort(unit, BigNumber(val));
    },
    [account],
  );

  const renderTickYCounterValue = useCallback(
    (val: number) => formatShort(counterValue.units[0], BigNumber(val)),
    [counterValue.units],
  );

  const displayCountervalue = countervalueFirst && countervalueAvailable;

  const AccountBalanceSummaryFooter = mainAccount
    ? perFamilyAccountBalanceSummaryFooter[mainAccount.currency.family]
    : null;

  const chartMagnitude = displayCountervalue
    ? counterValue.units[0].magnitude
    : getAccountUnit(account).magnitude;

  return (
    <Card p={0} py={5}>
      <Box px={6}>
        <AccountBalanceSummaryHeader
          account={account}
          counterValue={counterValue}
          selectedTimeRange={range}
          countervalueChange={countervalueChange}
          cryptoChange={cryptoChange}
          last={history[history.length - 1]}
          isAvailable={countervalueAvailable}
          countervalueFirst={displayCountervalue}
          setCountervalueFirst={setCountervalueFirst}
        />
      </Box>

      <Box px={5} ff="Inter" fontSize={4} color="palette.text.shade80" pt={5}>
        <Chart
          magnitude={chartMagnitude}
          color={chartColor}
          data={history}
          height={200}
          tickXScale={range}
          valueKey={displayCountervalue ? "countervalue" : "value"}
          renderTickY={
            discreetMode
              ? () => ""
              : displayCountervalue
              ? renderTickYCounterValue
              : renderTickYCryptoValue
          }
          renderTooltip={renderTooltip}
        />
      </Box>
      {AccountBalanceSummaryFooter && (
        <AccountBalanceSummaryFooter
          account={account}
          counterValue={counterValue}
          discreetMode={discreetMode}
        />
      )}
      {isCompoundEnabled && account.type === "TokenAccount" && parentAccount && ctoken && (
        <AccountLendingFooter
          account={account}
          parentAccount={parentAccount}
          countervalue={counterValue}
          discreetMode={discreetMode}
          ctoken={ctoken}
        />
      )}
    </Card>
  );
}

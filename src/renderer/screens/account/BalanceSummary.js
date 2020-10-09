// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { balanceHistoryWithCountervalueSelector } from "~/renderer/actions/portfolio";
import { BigNumber } from "bignumber.js";
import moment from "moment";
import { formatShort } from "@ledgerhq/live-common/lib/currencies";
import type {
  Currency,
  Account,
  TokenAccount,
  PortfolioRange,
  AccountPortfolio,
} from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import Chart from "~/renderer/components/Chart2";
import Box, { Card } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import AccountBalanceSummaryHeader from "./AccountBalanceSummaryHeader";
import { discreetModeSelector } from "~/renderer/reducers/settings";

import AccountLendingFooter from "~/renderer/screens/lend/Account/AccountBalanceSummaryFooter";

import perFamilyAccountBalanceSummaryFooter from "~/renderer/generated/AccountBalanceSummaryFooter";

type OwnProps = {
  counterValue: Currency,
  chartColor: string,
  chartId: string,
  account: Account | TokenAccount,
  parentAccount: ?Account,
  range: PortfolioRange,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
  mainAccount: ?Account,
  isCompoundEnabled?: boolean,
};

type Props = {
  ...OwnProps,
  discreetMode: boolean,
  balanceHistoryWithCountervalue: AccountPortfolio,
};

class AccountBalanceSummary extends PureComponent<Props> {
  renderTooltip = (d: any) => {
    const { account, counterValue, balanceHistoryWithCountervalue, countervalueFirst } = this.props;
    const displayCountervalue =
      countervalueFirst && balanceHistoryWithCountervalue.countervalueAvailable;
    const unit = getAccountUnit(account);
    const data = [
      { val: d.value, unit },
      { val: d.countervalue, unit: counterValue.units[0] },
    ];
    if (displayCountervalue) data.reverse();
    return (
      <>
        <FormattedVal fontSize={5} color="palette.text.shade100" showCode {...data[0]} />
        {balanceHistoryWithCountervalue.countervalueAvailable ? (
          <FormattedVal fontSize={4} color="warmGrey" showCode {...data[1]} />
        ) : null}
        <Box ff="Inter|Regular" color="palette.text.shade60" fontSize={3} mt={2}>
          {moment(d.date).format("LL")}
        </Box>
      </>
    );
  };

  renderTickYCryptoValue = (val: any) => {
    const { account } = this.props;
    const unit = getAccountUnit(account);
    return formatShort(unit, BigNumber(val));
  };

  renderTickYCounterValue = (val: number) =>
    formatShort(this.props.counterValue.units[0], BigNumber(val));

  // $FlowFixMe
  mapValueCounterValue = (d: BigNumber) => d.countervalue.toNumber();

  mapValueCryptoValue = (d: BigNumber) => d.value.toNumber();

  render() {
    const {
      account,
      parentAccount,
      balanceHistoryWithCountervalue: {
        history,
        countervalueAvailable,
        countervalueChange,
        cryptoChange,
      },
      range,
      chartColor,
      chartId,
      counterValue,
      countervalueFirst,
      setCountervalueFirst,
      discreetMode,
      mainAccount,
      isCompoundEnabled,
    } = this.props;
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
            id={chartId}
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
                ? this.renderTickYCounterValue
                : this.renderTickYCryptoValue
            }
            isInteractive
            renderTooltip={this.renderTooltip}
          />
        </Box>
        {AccountBalanceSummaryFooter && (
          <AccountBalanceSummaryFooter
            account={account}
            counterValue={counterValue}
            discreetMode={discreetMode}
          />
        )}
        {isCompoundEnabled && account.type === "TokenAccount" && parentAccount && (
          <AccountLendingFooter
            account={account}
            parentAccount={parentAccount}
            counterValue={counterValue}
            discreetMode={discreetMode}
            cToken={isCompoundEnabled}
          />
        )}
      </Card>
    );
  }
}

const ConnectedBalanceSummary: React$ComponentType<{}> = connect(
  createStructuredSelector({
    balanceHistoryWithCountervalue: balanceHistoryWithCountervalueSelector,
    discreetMode: discreetModeSelector,
  }),
)(AccountBalanceSummary);

export default ConnectedBalanceSummary;

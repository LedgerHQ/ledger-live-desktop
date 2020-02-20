// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import type {
  BalanceHistoryWithCountervalue,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";

import { balanceHistoryWithCountervalueSelector } from "~/renderer/actions/portfolio";
import Box from "~/renderer/components/Box";
import CounterValue from "~/renderer/components/CounterValue";
import { PlaceholderLine } from "~/renderer/components/Placeholder";

type OwnProps = {
  currency: CryptoCurrency | TokenCurrency,
};

type Props = OwnProps & {
  histo: {
    history: BalanceHistoryWithCountervalue,
    countervalueAvailable: boolean,
  },
};
class Countervalue extends PureComponent<Props> {
  render() {
    const { histo, currency } = this.props;
    const balanceEnd = histo.history[histo.history.length - 1].value;
    const placeholder = <PlaceholderLine width={16} height={2} />;
    return (
      <Box flex="20%">
        {histo.countervalueAvailable ? (
          <CounterValue
            currency={currency}
            value={balanceEnd}
            animateTicker={false}
            alwaysShowSign={false}
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
}

const ConnectedCountervalue: React$ComponentType<OwnProps> = connect(
  createStructuredSelector({
    histo: balanceHistoryWithCountervalueSelector,
  }),
)(Countervalue);

export default ConnectedCountervalue;

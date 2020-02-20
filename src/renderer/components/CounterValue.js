// @flow

import type { BigNumber } from "bignumber.js";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import type { Currency } from "@ledgerhq/live-common/lib/types";

import {
  counterValueCurrencySelector,
  exchangeSettingsForPairSelector,
  intermediaryCurrency,
} from "~/renderer/reducers/settings";
import CounterValues from "~/renderer/countervalues";

import FormattedVal from "~/renderer/components/FormattedVal";

import type { State } from "~/renderer/reducers";

type OwnProps = {
  // wich market to query
  currency: Currency,

  // when? if not given: take latest
  date?: Date,

  value: BigNumber,

  alwaysShowSign?: boolean,

  subMagnitude?: number,

  placeholder?: React$Node,

  prefix?: React$Node,
  suffix?: React$Node,
};

type StateProps = {|
  counterValueCurrency: Currency,
  value: ?number,
|};

type Props = {
  ...OwnProps,
  ...StateProps,
};

const mapStateToProps = (state: State, props: OwnProps) => {
  const { currency, value, date, subMagnitude } = props;
  const counterValueCurrency = counterValueCurrencySelector(state);
  const intermediary = intermediaryCurrency(currency, counterValueCurrency);
  const fromExchange = exchangeSettingsForPairSelector(state, { from: currency, to: intermediary });
  const toExchange = exchangeSettingsForPairSelector(state, {
    from: intermediary,
    to: counterValueCurrency,
  });
  const counterValue = CounterValues.calculateWithIntermediarySelector(state, {
    from: currency,
    fromExchange,
    intermediary,
    toExchange,
    to: counterValueCurrency,
    value,
    date,
    disableRounding: !!subMagnitude,
  });

  return {
    counterValueCurrency,
    value: counterValue,
  };
};

class CounterValue extends PureComponent<Props> {
  static defaultProps = {
    alwaysShowSign: true, // FIXME this shouldn't be true by default
  };

  render() {
    const {
      value,
      counterValueCurrency,
      date,
      alwaysShowSign,
      placeholder,
      prefix,
      suffix,
      ...props
    } = this.props;

    if (!value) {
      return placeholder || null;
    }

    return (
      <>
        {prefix || null}
        <FormattedVal
          {...props}
          val={value}
          unit={counterValueCurrency.units[0]}
          showCode
          alwaysShowSign={alwaysShowSign}
        />
        {suffix || null}
      </>
    );
  }
}

const ConnectedCounterValue: React$ComponentType<OwnProps> = connect(mapStateToProps)(CounterValue);
export default ConnectedCounterValue;

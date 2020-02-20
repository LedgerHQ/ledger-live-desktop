// @flow

import { BigNumber } from "bignumber.js";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { Currency, AccountLike } from "@ledgerhq/live-common/lib/types";

import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import CounterValues from "~/renderer/countervalues";
import IconTransfer from "~/renderer/icons/Transfer";
import {
  counterValueCurrencySelector,
  exchangeSettingsForPairSelector,
  intermediaryCurrency,
} from "~/renderer/reducers/settings";

import type { State } from "~/renderer/reducers";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
}))`
  padding-right: 10px;
`;

const InputCenter = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
  color: "palette.text.shade40",
}))`
  margin-left: 19px;
  margin-right: 19px;
`;

type OwnProps = {
  autoFocus?: boolean,
  // left value (always the one which is returned)
  value: BigNumber,

  disabled?: boolean,

  validTransactionError?: ?Error,
  validTransactionWarning?: ?Error,

  // max left value
  max?: BigNumber,

  // change handler
  onChange: BigNumber => void,

  // used to determine the left input unit
  account: AccountLike,
};

type Props = OwnProps & {
  // used to determine the right input unit
  // retrieved via selector (take the chosen countervalue unit)
  rightCurrency: Currency,

  // used to calculate the opposite field value (right & left)
  getCounterValue: BigNumber => ?BigNumber,
  getReverseCounterValue: BigNumber => ?BigNumber,
};

const mapStateToProps = (state: State, props: OwnProps) => {
  const { account } = props;
  const counterValueCurrency = counterValueCurrencySelector(state);
  const currency = getAccountCurrency(account);
  const intermediary = intermediaryCurrency(currency, counterValueCurrency);
  const fromExchange = exchangeSettingsForPairSelector(state, { from: currency, to: intermediary });
  const toExchange = exchangeSettingsForPairSelector(state, {
    from: intermediary,
    to: counterValueCurrency,
  });

  // FIXME this make the component not working with "Pure". is there a way we can calculate here whatever needs to be?
  // especially the value comes from props!
  const getCounterValue = value =>
    CounterValues.calculateWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary,
      toExchange,
      to: counterValueCurrency,
      value,
      disableRounding: true,
    });
  const getReverseCounterValue = value =>
    CounterValues.reverseWithIntermediarySelector(state, {
      from: currency,
      fromExchange,
      intermediary,
      toExchange,
      to: counterValueCurrency,
      value,
    });

  return {
    rightCurrency: counterValueCurrency,
    getCounterValue,
    getReverseCounterValue,
  };
};

export class RequestAmount extends PureComponent<Props> {
  static defaultProps = {
    max: BigNumber(Infinity),
    validTransaction: true,
  };

  handleClickMax = () => {
    const { max, onChange } = this.props;
    if (isFinite(max)) {
      onChange(max);
    }
  };

  handleChangeAmount = (changedField: string) => (val: BigNumber) => {
    const { getReverseCounterValue, max, onChange } = this.props;
    if (changedField === "left") {
      onChange(val.gt(max) ? max : val);
    } else if (changedField === "right") {
      const leftVal = getReverseCounterValue(val) || BigNumber(0);
      onChange(leftVal.gt(max) ? max : leftVal);
    }
  };

  onLeftChange = this.handleChangeAmount("left");
  onRightChange = this.handleChangeAmount("right");

  render() {
    const {
      autoFocus,
      disabled,
      value,
      account,
      rightCurrency,
      getCounterValue,
      validTransactionError,
      validTransactionWarning,
    } = this.props;
    const right = getCounterValue(value) || BigNumber(0);
    const rightUnit = rightCurrency.units[0];
    const defaultUnit = getAccountUnit(account);
    return (
      <Box horizontal flow={5} alignItems="center">
        <Box horizontal grow shrink>
          <InputCurrency
            autoFocus={autoFocus}
            disabled={disabled}
            error={validTransactionError}
            warning={validTransactionWarning}
            containerProps={{ grow: true }}
            defaultUnit={defaultUnit}
            value={value}
            onChange={this.onLeftChange}
            renderRight={<InputRight>{defaultUnit.code}</InputRight>}
          />
          <InputCenter>
            <IconTransfer />
          </InputCenter>
          <InputCurrency
            disabled={disabled}
            containerProps={{ grow: true }}
            defaultUnit={rightUnit}
            value={right}
            onChange={this.onRightChange}
            renderRight={<InputRight>{rightUnit.code}</InputRight>}
            showAllDigits
            subMagnitude={3}
          />
        </Box>
      </Box>
    );
  }
}

const m: React$ComponentType<OwnProps> = connect(mapStateToProps)(RequestAmount);

export default m;

// @flow
import { BigNumber } from "bignumber.js";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import { useSendAmount } from "@ledgerhq/live-common/lib/countervalues/react";
import Box from "~/renderer/components/Box";
import InputCurrency from "~/renderer/components/InputCurrency";
import IconTransfer from "~/renderer/icons/Transfer";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import TranslatedError from "./TranslatedError";

const ErrorContainer = styled(Box)`
  margin-top: 0px;
  font-size: 12px;
  width: 100%;
  transition: all 0.4s ease-in-out;
  will-change: max-height;
  max-height: ${p => (p.hasError ? 60 : 0)}px;
  min-height: ${p => (p.hasError ? 20 : 0)}px;
`;

const ErrorDisplay = styled(Box)`
  color: ${p => p.theme.colors.pearl};
`;

const WarningDisplay = styled(Box)`
  color: ${p => p.theme.colors.warning};
`;

type Props = {
  autoFocus?: boolean,
  // crypto value (always the one which is returned)
  value: BigNumber,
  disabled?: boolean,
  validTransactionError?: ?Error,
  validTransactionWarning?: ?Error,
  // change handler
  onChange: BigNumber => void,
  // used to determine the crypto input unit
  account: AccountLike,
};

export default function RequestAmount({
  onChange,
  autoFocus,
  disabled,
  value: cryptoAmount,
  account,
  validTransactionError,
  validTransactionWarning,
}: Props) {
  const fiatCurrency = useSelector(counterValueCurrencySelector);
  const { cryptoUnit, fiatAmount, fiatUnit, calculateCryptoAmount } = useSendAmount({
    account,
    fiatCurrency,
    cryptoAmount,
  });

  const onChangeFiatAmount = useCallback(
    (fiatAmount: BigNumber) => {
      const amount = calculateCryptoAmount(fiatAmount);
      onChange(amount);
    },
    [onChange, calculateCryptoAmount],
  );

  return (
    <Box vertical flow={5} alignItems="center">
      <Box horizontal grow shrink>
        <InputCurrency
          autoFocus={autoFocus}
          disabled={disabled}
          hideErrorMessage
          error={validTransactionError}
          warning={validTransactionWarning}
          containerProps={{ grow: true }}
          defaultUnit={cryptoUnit}
          value={cryptoAmount}
          onChange={onChange}
          renderRight={<InputRight>{cryptoUnit.code}</InputRight>}
        />
        <InputCenter>
          <IconTransfer />
        </InputCenter>
        <InputCurrency
          disabled={disabled}
          containerProps={{ grow: true }}
          defaultUnit={fiatUnit}
          value={fiatAmount}
          onChange={onChangeFiatAmount}
          renderRight={<InputRight>{fiatUnit.code}</InputRight>}
          showAllDigits
          subMagnitude={3}
        />
      </Box>
      <ErrorContainer hasError={validTransactionError || validTransactionWarning}>
        {validTransactionError ? (
          <ErrorDisplay id="input-error">
            <TranslatedError error={validTransactionError} />
          </ErrorDisplay>
        ) : validTransactionWarning ? (
          <WarningDisplay id="input-warning">
            <TranslatedError error={validTransactionWarning} />
          </WarningDisplay>
        ) : null}
      </ErrorContainer>
    </Box>
  );
}

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

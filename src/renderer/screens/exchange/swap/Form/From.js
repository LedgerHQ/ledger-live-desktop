// @flow

import React, { useCallback, useEffect } from "react";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import InputCurrency from "~/renderer/components/InputCurrency";
import CounterValue from "~/renderer/components/CounterValue";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
  Currency,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Input from "~/renderer/components/Input";
import Text from "~/renderer/components/Text";
import type { Option } from "~/renderer/components/Select";
import Switch from "~/renderer/components/Switch";
import { CurrencyOptionRow } from "~/renderer/screens/exchange/swap/Form/index";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import { AmountRequired } from "@ledgerhq/errors";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import { useSelector } from "react-redux";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
}))`
  padding-right: 10px;
`;

const CountervalueWrapper = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  color: "palette.text.shade60",
  fontSize: 2,
  justifyContent: "center",
  alignItems: "center",
  horizontal: true,
}))`
  line-height: 1.2em;
`;

const From = ({
  currencies,
  currency: defaultCurrency,
  account: defaultAccount,
  currenciesStatus,
  amount,
  useAllAmount,
  isLoading,
  error,
  status,
  onAccountChange,
  onToggleUseAllAmount,
  onAmountChange,
  onCurrencyChange,
}: {
  currencies: (CryptoCurrency | TokenCurrency)[],
  currency: ?(CryptoCurrency | TokenCurrency),
  account: ?Account,
  currenciesStatus: CurrenciesStatus,
  amount: BigNumber,
  useAllAmount?: boolean,
  isLoading?: boolean,
  error: ?Error,
  status: TransactionStatus,
  onCurrencyChange: (?Currency) => void,
  onAccountChange: (AccountLike, ?Account) => void,
  onAmountChange: BigNumber => void,
  onToggleUseAllAmount?: () => void,
}) => {
  const accounts = useSelector(shallowAccountsSelector);
  const {
    availableAccounts,
    currency,
    account,
    subAccount,
    setCurrency,
    setAccount,
  } = useCurrencyAccountSelect({
    allAccounts: accounts,
    allCurrencies: currencies,
    defaultCurrency,
    defaultAccount,
    hideEmpty: true,
  });

  const unit = currency && currency.units[0];
  const renderOptionOverride = useCallback(
    ({ data: currency }: Option) => {
      const status = currenciesStatus[currency.id];
      return <CurrencyOptionRow circle currency={currency} status={status} />;
    },
    [currenciesStatus],
  );

  const isCurrencySelectorDisabled = useCallback(
    c =>
      (c.type === "CryptoCurrency" || c.type === "TokenCurrency") &&
      currenciesStatus[c.id] !== "ok",
    [currenciesStatus],
  );

  useEffect(() => {
    if (currency && currency?.id !== defaultCurrency?.id) {
      onCurrencyChange(currency);
    }
  }, [currency, defaultCurrency, onCurrencyChange]);

  useEffect(() => {
    if (account?.id !== defaultAccount?.id) {
      const fromAccount = subAccount || account;
      const fromParentAccount = subAccount ? account : null;
      if (fromAccount && fromAccount?.id !== defaultAccount?.id) {
        onAccountChange(fromAccount, fromParentAccount);
      }
    }
  }, [account, subAccount, currency, defaultAccount, onAccountChange]);

  const amountError = amount.gt(0) && (error || status.errors?.gasPrice || status.errors?.amount);
  const hideError = useAllAmount && amountError && amountError instanceof AmountRequired;

  return (
    <Box flex={1} flow={1} mb={3} ml={0} mr={23}>
      <Text mb={15} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.form.from.title`} />
      </Text>
      {currency ? <CurrencyDownStatusAlert currencies={[currency]} /> : null}
      <Box>
        <Label mb={4}>
          <Trans i18nKey={`swap.form.from.currency`} />
        </Label>
        <SelectCurrency
          id="swap-form-from-currency"
          rowHeight={47}
          renderOptionOverride={renderOptionOverride}
          currencies={currencies}
          value={currency}
          autoFocus={true}
          onChange={setCurrency}
          isDisabled={isCurrencySelectorDisabled}
        />
      </Box>
      <Box>
        <Label mb={4} mt={25}>
          <Trans i18nKey={`swap.form.from.account`} />
        </Label>
        <SelectAccount
          id="swap-form-from-account"
          isDisabled={!currency}
          accounts={availableAccounts}
          value={{ account, subAccount }}
          onChange={setAccount}
        />
      </Box>
      <Box style={{ minHeight: 120 }}>
        <Box mt={25} horizontal alignItems="center" justifyContent="space-between">
          <Label mb={4}>
            <Trans i18nKey={`swap.form.from.amount`} />
          </Label>
          <Box horizontal alignItems="center">
            <Text
              color="palette.text.shade40"
              ff="Inter|Medium"
              fontSize={10}
              style={{ paddingRight: 5 }}
              onClick={onToggleUseAllAmount}
            >
              <Trans i18nKey="send.steps.details.useMax" />
            </Text>
            <Switch small isChecked={!!useAllAmount} onChange={onToggleUseAllAmount} />
          </Box>
        </Box>
        {unit ? (
          <>
            <InputCurrency
              id="swap-form-from-amount"
              error={!hideError && amountError}
              loading={isLoading}
              key={unit.code}
              defaultUnit={unit}
              value={isLoading ? "" : amount}
              disabled={useAllAmount}
              onChange={onAmountChange}
              renderRight={<InputRight>{unit.code}</InputRight>}
            />
            {currency && amount?.gt(0) && !amountError ? (
              <CountervalueWrapper mt={1}>
                <CounterValue
                  prefix={<Text mr={1}>{"≈"}</Text>}
                  currency={currency}
                  value={amount}
                  disableRounding
                  color="palette.text.shade60"
                  fontSize={2}
                  showCode
                />
              </CountervalueWrapper>
            ) : null}
          </>
        ) : (
          <Input disabled />
        )}
      </Box>
    </Box>
  );
};

export default From;

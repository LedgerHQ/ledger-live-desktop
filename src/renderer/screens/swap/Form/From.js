// @flow

import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import InputCurrency from "~/renderer/components/InputCurrency";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
  Currency,
} from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Text from "~/renderer/components/Text";
import type { Option } from "~/renderer/components/Select";
import Switch from "~/renderer/components/Switch";
import { CurrencyOptionRow } from "~/renderer/screens/swap/Form/index";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/swap/logic";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
}))`
  padding-right: 10px;
`;

const From = ({
  currencies,
  currency: defaultCurrency,
  account: defaultAccount,
  currenciesStatus,
  validAccounts,
  amount,
  useAllAmount,
  isLoading,
  error,
  onAccountChange,
  onToggleUseAllAmount,
  onAmountChange,
  onCurrencyChange,
}: {
  currencies: (CryptoCurrency | TokenCurrency)[],
  currency: ?(CryptoCurrency | TokenCurrency),
  account: ?Account,
  currenciesStatus: CurrenciesStatus,
  validAccounts: Account[],
  amount: BigNumber,
  onCurrencyChange: (?Currency) => void,
  onAccountChange: (AccountLike, ?Account) => void,
  onAmountChange: BigNumber => void,
  onToggleUseAllAmount?: () => void,
  useAllAmount?: boolean,
  isLoading?: boolean,
  error: ?Error,
}) => {
  const {
    availableAccounts,
    currency,
    account,
    subAccount,
    setCurrency,
    setAccount,
  } = useCurrencyAccountSelect({
    allCurrencies: currencies,
    allAccounts: validAccounts,
    defaultCurrency,
    defaultAccount,
  });
  const unit = currency && currency.units[0];
  const renderOptionOverride = ({ data: currency }: Option) => {
    const status = currenciesStatus[currency.id];
    return <CurrencyOptionRow circle currency={currency} status={status} />;
  };

  // NB this feels like I'm doing the work twice, but ¯\_(ツ)_/¯
  const onCurrencySelected = useCallback(
    currency => {
      if (!currency) return;
      setCurrency(currency);
      onCurrencyChange(currency);
    },
    [onCurrencyChange, setCurrency],
  );

  const onAccountSelected = useCallback(
    (account, subAccount) => {
      if (!account) return;
      const toAccount = subAccount || account;
      const toParentAccount = subAccount ? account : null;
      // TODO Ideally we would maintain the account/parentAccount paradigm instead of account/subAccount
      setAccount(account, subAccount);
      onAccountChange(toAccount, toParentAccount);
    },
    [onAccountChange, setAccount],
  );

  return (
    <Box flex={1} flow={1} mb={3} ml={0} mr={23}>
      <Text mb={15} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.form.from.title`} />
      </Text>
      <Box>
        <Label mb={4}>
          <Trans i18nKey={`swap.form.from.currency`} />
        </Label>
        <SelectCurrency
          rowHeight={47}
          renderOptionOverride={renderOptionOverride}
          currencies={currencies}
          autoFocus={true}
          onChange={onCurrencySelected}
          value={currency}
          isDisabled={c =>
            (c.type === "CryptoCurrency" || c.type === "TokenCurrency") &&
            currenciesStatus[c.id] !== "ok"
          }
        />
      </Box>
      <Box>
        <Label mb={4} mt={25}>
          <Trans i18nKey={`swap.form.from.account`} />
        </Label>
        <SelectAccount
          accounts={availableAccounts}
          value={{ account, subAccount }}
          onChange={onAccountSelected}
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
          <InputCurrency
            error={amount && amount.gt(0) && error}
            loading={isLoading}
            key={unit.code}
            defaultUnit={unit}
            value={isLoading ? "" : amount}
            disabled={useAllAmount}
            onChange={onAmountChange}
            renderRight={<InputRight>{unit.code}</InputRight>}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default From;

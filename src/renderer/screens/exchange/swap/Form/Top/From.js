// @flow

import React, { useCallback, useEffect } from "react";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Text from "~/renderer/components/Text";
import type { Option } from "~/renderer/components/Select";
import CurrencyOptionRow from "~/renderer/screens/exchange/swap/Form/CurrencyOptionRow";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import { useSelector } from "react-redux";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";

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
  onCurrencyChange: (?(CryptoCurrency | TokenCurrency)) => void,
  onAccountChange: (AccountLike, ?Account) => void,
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

  return (
    <Box flex={1} flow={1} mb={3} ml={0} mr={23}>
      <Text mb={2} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.form.from.title`} />
      </Text>
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
    </Box>
  );
};

export default From;

// @flow

import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import InputCurrency from "~/renderer/components/InputCurrency";
import React, { useEffect, useCallback } from "react";
import type {
  AccountLike,
  Account,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Input from "~/renderer/components/Input";
import Text from "~/renderer/components/Text";
import ToolTip from "~/renderer/components/Tooltip";
import Price from "~/renderer/components/Price";
import IconPlusSmall from "~/renderer/icons/PlusSmall";
import { openModal } from "~/renderer/actions/modals";
import { useSelector, useDispatch } from "react-redux";
import { CurrencyOptionRow } from "~/renderer/screens/exchange/swap/Form";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import InfoCircle from "~/renderer/icons/InfoCircle";
import IconLock from "~/renderer/icons/Lock";
import useTheme from "~/renderer/hooks/useTheme";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
}))`
  padding-right: 10px;
`;

const AddAccount = styled.div`
  display: flex;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  align-items: center;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  height: 48px;
  padding: 0 15px;
  border-radius: 4px;
  color: ${p => p.theme.colors.palette.primary.main};
`;

const SwapInputGroup = ({
  currencies,
  currency: defaultCurrency,
  fromCurrency,
  account: defaultAccount,
  currenciesStatus,
  amount,
  rate,
  error,
  onAccountChange,
  onCurrencyChange,
}: {
  currencies: (CryptoCurrency | TokenCurrency)[],
  currency: ?(CryptoCurrency | TokenCurrency),
  fromCurrency: ?(CryptoCurrency | TokenCurrency),
  account: ?Account,
  currenciesStatus: CurrenciesStatus,
  amount: ?BigNumber,
  rate?: BigNumber,
  error?: Error,
  onAccountChange: (AccountLike, ?Account) => void,
  onCurrencyChange: (CryptoCurrency | TokenCurrency) => void,
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
    allCurrencies: currencies,
    allAccounts: accounts,
    defaultCurrency,
    defaultAccount,
  });

  useEffect(() => {
    if (!account && currency) {
      const maybeAccount = accounts.find(a => getAccountCurrency(a).id === currency.id);
      if (maybeAccount) {
        setAccount(maybeAccount);
      }
    }
  }, [account, accounts, currency, setAccount]);

  const unit = currency && currency.units[0];
  const renderOptionOverride = useCallback(
    ({ data: currency }: any) => {
      // NB ignore the custom rendering for no-accounts here since we show the add account CTA
      const status = currenciesStatus[currency.id];

      return (
        <CurrencyOptionRow
          circle
          currency={currency}
          status={status === "noAccounts" ? "ok" : status}
        />
      );
    },
    [currenciesStatus],
  );

  const dispatch = useDispatch();
  const addAccount = useCallback(() => dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency })), [
    currency,
    dispatch,
  ]);

  const hasMaybeValidAccounts = availableAccounts && availableAccounts.length > 0;

  const lockColor = useTheme("colors.palette.text.shade50");

  useEffect(() => {
    if (currency && currency?.id !== defaultCurrency?.id) {
      onCurrencyChange(currency);
    }
  }, [currency, defaultCurrency, onCurrencyChange]);

  useEffect(() => {
    if (account?.id !== defaultAccount?.id) {
      const toAccount = subAccount || account;
      const toParentAccount = subAccount ? account : null;
      if (toAccount && toAccount?.id !== defaultAccount?.id) {
        onAccountChange(toAccount, toParentAccount);
      }
    }
  }, [account, subAccount, currency, defaultAccount, onAccountChange]);

  const isCurrencySelectorDisabled = useCallback(
    c =>
      (c.type === "CryptoCurrency" || c.type === "TokenCurrency") &&
      ["noApp", "outdatedApp"].includes(currenciesStatus[c.id]),
    [currenciesStatus],
  );

  return (
    <Box flex={1} flow={1} mb={3} ml={23}>
      <Text mb={15} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.form.to.title`} />
      </Text>
      {currency ? <CurrencyDownStatusAlert currencies={[currency]} /> : null}
      <Box>
        <Label mb={4}>
          <Trans i18nKey={`swap.form.to.currency`} />
        </Label>
        <SelectCurrency
          id="swap-form-to-currency"
          renderOptionOverride={renderOptionOverride}
          currencies={currencies}
          autoFocus={true}
          onChange={setCurrency}
          value={currency}
          rowHeight={47}
          isDisabled={isCurrencySelectorDisabled}
        />
      </Box>
      <Box>
        <Label mb={4} mt={25}>
          <Trans i18nKey={`swap.form.to.account`} />
        </Label>
        {hasMaybeValidAccounts || !currency ? (
          <SelectAccount
            id="swap-form-to-account"
            isDisabled={!currency}
            accounts={availableAccounts}
            value={{ account, subAccount }}
            onChange={setAccount}
          />
        ) : (
          <AddAccount onClick={addAccount}>
            <IconPlusSmall size={16} />
            <Text ml={1} ff="Inter|SemiBold" fontSize={4}>
              <Trans i18nKey={`swap.form.to.addAccountCTA`} />
            </Text>
          </AddAccount>
        )}
      </Box>
      <Box>
        <Label mb={4} mt={25}>
          <Trans i18nKey={`swap.form.to.amount`} />
          <ToolTip
            content={
              <Box style={{ maxWidth: 200 }}>
                <Trans i18nKey={"swap.form.bubble"} />
              </Box>
            }
          >
            <Box ml={1}>
              <InfoCircle size={12} />
            </Box>
          </ToolTip>
        </Label>

        {unit ? (
          <>
            <InputCurrency
              error={error}
              disabled
              key={unit.code}
              defaultUnit={unit}
              value={amount || ""}
              renderRight={<InputRight>{unit.code}</InputRight>}
              onChange={() => undefined}
            />
            {rate && fromCurrency && currency ? (
              <Box horizontal mt={1} alignItems={"center"}>
                <Box mr={1}>
                  <IconLock size={10} color={lockColor} />
                </Box>
                <Price
                  withEquality
                  withIcon={false}
                  from={fromCurrency}
                  to={currency}
                  rate={rate}
                  color="palette.text.shade60"
                  fontSize={2}
                />
              </Box>
            ) : null}
          </>
        ) : (
          <Input disabled />
        )}
      </Box>
    </Box>
  );
};

export default SwapInputGroup;

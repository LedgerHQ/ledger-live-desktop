// @flow

import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import SelectAccount from "~/renderer/components/SelectAccount";
import InputCurrency from "~/renderer/components/InputCurrency";
import React, { useCallback } from "react";
import type { AccountLike, Currency } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Text from "~/renderer/components/Text";
import Price from "~/renderer/components/Price";
import IconPlusSmall from "~/renderer/icons/PlusSmall";
import { openModal } from "~/renderer/actions/modals";
import { useDispatch } from "react-redux";
import { CurrencyOptionRow } from "~/renderer/screens/swap/Form";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/swap/logic";

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
  validAccounts,
  currency,
  fromCurrency,
  account,
  currenciesStatus,
  amount,
  onCurrencyChange,
  onAccountChange,
  rate,
  error,
}: {
  currencies: Currency[],
  currency: Currency,
  fromCurrency: Currency,
  account: ?AccountLike,
  currenciesStatus: CurrenciesStatus,
  validAccounts: AccountLike[],
  amount: ?BigNumber,
  onCurrencyChange: (?Currency) => void,
  onAccountChange: (?AccountLike) => void,
  rate?: BigNumber,
  error?: Error,
}) => {
  const unit = currency && currency.units[0];
  const renderOptionOverride = ({ data: currency }: any) => {
    // NB ignore the custom rendering for no-accounts here since we show the add account CTA
    const status = currenciesStatus[currency.id];

    return (
      <CurrencyOptionRow
        circle
        currency={currency}
        status={status === "noAccounts" ? "ok" : status}
      />
    );
  };

  const dispatch = useDispatch();
  const addAccount = useCallback(() => dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency })), [
    currency,
    dispatch,
  ]);

  const hasMaybeValidAccounts =
    (validAccounts && validAccounts.length > 0) ||
    (currency.type === "TokenCurrency" &&
      validAccounts.find(a => getAccountCurrency(a).id === currency.parentCurrency));

  return (
    <Box flex={1} flow={1} mb={3} ml={23}>
      <Text mb={15} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.form.to.title`} />
      </Text>
      <Box>
        <Label mb={4}>
          <Trans i18nKey={`swap.form.to.currency`} />
        </Label>
        <SelectCurrency
          renderOptionOverride={renderOptionOverride}
          currencies={currencies}
          autoFocus={true}
          onChange={onCurrencyChange}
          value={currency}
          rowHeight={47}
          isDisabled={c =>
            (c.type === "CryptoCurrency" || c.type === "TokenCurrency") &&
            currenciesStatus[c.id] === "noApp"
          }
        />
      </Box>
      <Box>
        <Label mb={4} mt={25}>
          <Trans i18nKey={`swap.form.to.account`} />
        </Label>
        {hasMaybeValidAccounts ? (
          <SelectAccount
            withSubAccounts
            filter={a => {
              const accountCurrency = getAccountCurrency(a);
              return (
                currency === accountCurrency ||
                (currency.type === "TokenCurrency" && currency === accountCurrency)
              );
            }}
            autoFocus={true}
            onChange={onAccountChange}
            value={account}
            accounts={validAccounts}
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
            {rate ? (
              <Box mt={1}>
                <Price
                  withEquality
                  from={fromCurrency}
                  to={currency}
                  rate={rate}
                  color="palette.text.shade60"
                  fontSize={2}
                />
              </Box>
            ) : null}
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default SwapInputGroup;

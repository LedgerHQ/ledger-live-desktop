// @flow

import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import SelectAccount from "~/renderer/components/SelectAccount";
import InputCurrency from "~/renderer/components/InputCurrency";
import React from "react";
import type { AccountLike, Currency } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Text from "~/renderer/components/Text";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { Option } from "~/renderer/components/Select";
import Switch from "~/renderer/components/Switch";
import { CurrencyOptionRow } from "~/renderer/screens/swap/Form/index";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/swap/logic";

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
  validAccounts,
  currency,
  account,
  currenciesStatus,
  amount,
  onCurrencyChange,
  onAccountChange,
  onAmountChange,
  onUseAllAmountToggle,
  useAllAmount,
  isLoading,
  error,
}: {
  currencies: Currency[],
  currency: ?Currency,
  account: AccountLike,
  currenciesStatus: CurrenciesStatus,
  validAccounts: AccountLike[],
  amount: BigNumber,
  onCurrencyChange: (?Currency) => void,
  onAccountChange: (?AccountLike) => void,
  onAmountChange: BigNumber => void,
  onUseAllAmountToggle?: () => void,
  useAllAmount?: boolean,
  isLoading?: boolean,
  error: ?Error,
}) => {
  const unit = currency && currency.units[0];
  const renderOptionOverride = ({ data: currency }: Option) => {
    const status = currenciesStatus[currency.id];
    return <CurrencyOptionRow circle currency={currency} status={status} />;
  };

  if (!currency) return null; // FIXME, likely need to account for no valid swap combinations

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
          onChange={onCurrencyChange}
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
          enforceHideEmptySubAccounts
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
              onClick={onUseAllAmountToggle}
            >
              <Trans i18nKey="send.steps.details.useMax" />
            </Text>
            <Switch small isChecked={!!useAllAmount} onChange={onUseAllAmountToggle} />
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

// @flow

import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import InputCurrency from "~/renderer/components/InputCurrency";
import React, { useCallback } from "react";
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
import { useDispatch } from "react-redux";
import { CurrencyOptionRow } from "~/renderer/screens/swap/Form";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/swap/logic";
import InfoCircle from "~/renderer/icons/InfoCircle";
import IconLock from "~/renderer/icons/Lock";
import useTheme from "~/renderer/hooks/useTheme";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";

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
  validAccounts,
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
  validAccounts: Account[],
  amount: ?BigNumber,
  rate?: BigNumber,
  error?: Error,
  onAccountChange: (AccountLike, ?Account) => void,
  onCurrencyChange: (CryptoCurrency | TokenCurrency) => void,
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

  const hasMaybeValidAccounts = validAccounts && validAccounts.length > 0;

  const lockColor = useTheme("colors.palette.text.shade50");

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
          onChange={onCurrencySelected}
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
        {hasMaybeValidAccounts || !currency ? (
          <SelectAccount
            isDisabled={!currency}
            accounts={availableAccounts}
            value={{ account, subAccount }}
            onChange={onAccountSelected}
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

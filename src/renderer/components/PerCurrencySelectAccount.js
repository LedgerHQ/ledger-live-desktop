// @flow

import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import type { TFunction } from "react-i18next";
import type { AccountLike, Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import React, { useCallback, useState, useMemo } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { createFilter } from "react-select";
import { createStructuredSelector } from "reselect";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import Select from "~/renderer/components/Select";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";
import {
  accountWithMandatoryTokens,
  listSubAccounts,
} from "@ledgerhq/live-common/lib/account/helpers";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import type { SubAccount } from "@ledgerhq/live-common/lib/types/account";

const mapStateToProps = createStructuredSelector({
  accounts: shallowAccountsSelector,
});

type Option = {
  matched: "boolean",
  account: Account,
};
const getOptionValue = option => option.account && option.account.id;

const defaultFilter = createFilter({
  stringify: ({ data: account }) => {
    const currency = getAccountCurrency(account);
    const name = getAccountName(account);
    return `${currency.ticker}|${currency.name}|${name}`;
  },
});
const filterOption = o => (candidate, input) => {
  const selfMatches = defaultFilter(candidate, input);
  if (selfMatches) return [selfMatches, true];
  return [false, false];
};

const AccountOption = React.memo(function AccountOption({
  account,
  currency,
  disabled,
}: {
  account: Account,
  currency: CryptoCurrency | TokenCurrency,
  disabled?: boolean,
}) {
  const mainCurrency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const name = getAccountName(account);

  if (currency.type === "TokenCurrency") {
    const subAccount = getSubAccountFromAccountByCurrency(account, currency);
    if (!subAccount) {
      return null; // should not happen but flow force me \__:)__/;
    }

    const subAccountUnit = getAccountUnit(subAccount);

    return (
      <Box grow horizontal alignItems="center" flow={2} style={{ opacity: disabled ? 0.2 : 1 }}>
        <ParentCryptoCurrencyIcon currency={currency} flat />
        <div style={{ flex: 1 }}>
          <Ellipsis ff="Inter|SemiBold" fontSize={4}>
            {name}
          </Ellipsis>
        </div>
        <Box>
          <FormattedVal
            color="palette.text.shade60"
            val={subAccount.balance}
            unit={subAccountUnit}
            showCode
            disableRounding
          />
        </Box>
      </Box>
    );
  }
  return (
    <Box grow horizontal alignItems="center" flow={2} style={{ opacity: disabled ? 0.2 : 1 }}>
      <CryptoCurrencyIcon currency={mainCurrency} size={16} />
      <div style={{ flex: 1 }}>
        <Ellipsis ff="Inter|SemiBold" fontSize={4}>
          {name}
        </Ellipsis>
      </div>
      <Box>
        <FormattedVal
          color="palette.text.shade60"
          val={account.balance}
          unit={unit}
          showCode
          disableRounding
        />
      </Box>
    </Box>
  );
});

type OwnProps = {
  currency: TokenCurrency | CryptoCurrency,
  mandatoryTokens?: boolean,
  value: ?AccountLike,
  onChange: (account: ?AccountLike, tokenAccount: ?Account) => void,
};

type Props = OwnProps & {
  accounts: Account[],
  t: TFunction,
  onChange: (account: ?AccountLike, tokenAccount: ?Account) => void, // I have to add it twice else flow is unhappy, don't ask why
};

const getAccountsByCurrency = (accounts: Account[], currency: TokenCurrency | CryptoCurrency) =>
  accounts.filter((acc: Account) => acc.currency.id === currency.id);
const getSubAccountFromAccountByCurrency = (
  account: Account,
  currency: TokenCurrency | CryptoCurrency,
) =>
  listSubAccounts(account).find(
    (subAcc: SubAccount) => getAccountCurrency(subAcc).id === currency.id,
  );

const stripAccountFromSubaccounts = (acc: Account, currency: TokenCurrency | CryptoCurrency) => ({
  ...acc,
  subAccounts: listSubAccounts(acc).filter(
    (subAcc: SubAccount) => getAccountCurrency(subAcc).id === currency.id,
  ),
});

const RawSelectAccount = ({
  accounts,
  onChange,
  value,
  t,
  currency,
  mandatoryTokens,
  ...props
}: Props) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  const accountsForCurrency = useMemo(() => {
    if (currency.type === "TokenCurrency") {
      return getAccountsByCurrency(accounts, currency.parentCurrency).map((acc: Account) => {
        const strippedAccount = stripAccountFromSubaccounts(acc, currency);

        if (mandatoryTokens) {
          return accountWithMandatoryTokens(strippedAccount, [currency]);
        }
        return strippedAccount;
      });
    }
    return getAccountsByCurrency(accounts, currency);
  }, [accounts, currency, mandatoryTokens]);

  const renderValue = ({ data }: { data: Option }) =>
    data.account ? <AccountOption account={data.account} isValue currency={currency} /> : null;

  const renderOption = ({ data }: { data: Option }) =>
    data.account ? (
      <AccountOption account={data.account} disabled={!data.matched} currency={currency} />
    ) : null;

  const selectedOption = value
    ? {
        account: accountsForCurrency.find(o => o.id === value.id),
      }
    : null;

  const onChangeCallback = useCallback(
    (option?: Option) => {
      if (!option) {
        onChange(null);
      } else {
        const { account } = option;
        if (currency.type === "TokenCurrency") {
          const subAccount = listSubAccounts(account).find(
            (subAcc: SubAccount) => getAccountCurrency(subAcc).id === currency.id,
          );
          onChange(subAccount, account);
        } else {
          onChange(account, null);
        }
      }
    },
    [accountsForCurrency, onChange, currency.id, currency.type],
  );

  const manualFilter = useCallback(
    () =>
      accountsForCurrency.reduce((result, option) => {
        const [display, match] = filterOption({
          currency,
        })({ data: option }, searchInputValue);

        if (display) {
          result.push({
            matched: match,
            account: option,
          });
        }
        return result;
      }, []),
    [searchInputValue, accountsForCurrency, currency],
  );

  const structuredResults = manualFilter();
  return (
    <Select
      {...props}
      value={selectedOption}
      options={structuredResults}
      getOptionValue={getOptionValue}
      renderValue={renderValue}
      renderOption={renderOption}
      onInputChange={v => setSearchInputValue(v)}
      inputValue={searchInputValue}
      filterOption={false}
      isOptionDisabled={option => !option.matched}
      placeholder={t("common.selectAccount")}
      noOptionsMessage={({ inputValue }) =>
        t("common.selectAccountNoOption", { accountName: inputValue })
      }
      onChange={onChangeCallback}
    />
  );
};

export const SelectAccount: React$ComponentType<Props> = withTranslation()(RawSelectAccount);

const m: React$ComponentType<OwnProps> = connect(mapStateToProps)(SelectAccount);

export default m;

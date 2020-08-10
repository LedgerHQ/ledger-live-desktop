// @flow

import { getAccountCurrency, getAccountName } from "@ledgerhq/live-common/lib/account";
import type { TFunction } from "react-i18next";
import type { Account } from "@ledgerhq/live-common/lib/types";
import React, { useCallback, useState } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { createFilter } from "react-select";
import { createStructuredSelector } from "reselect";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import Select from "~/renderer/components/Select";
import type { SubAccount } from "@ledgerhq/live-common/lib/types/account";
import { MenuOption } from "~/renderer/components/PerCurrencySelectAccount/Option";
import type { AccountTuple } from "~/renderer/components/PerCurrencySelectAccount/state";

const mapStateToProps = createStructuredSelector({
  accounts: shallowAccountsSelector,
});

type Option = {
  matched: "boolean",
  account: Account,
  subAccount: SubAccount,
};
const getOptionValue = option => {
  return option.account ? option.account.id : null;
};

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
  subAccount,
  isValue,
}: {
  account: Account,
  subAccount: SubAccount,
  isValue?: boolean,
}) {
  return <MenuOption isValue={isValue} account={account} subAccount={subAccount} />;
});

type OwnProps = {
  value: AccountTuple,
  onChange: (account: ?Account, subAccount: ?SubAccount) => void,
  accounts: AccountTuple[],
};

type Props = {
  ...OwnProps,
  t: TFunction,
};

const RawSelectAccount = ({ accounts, value, onChange, t, ...props }: Props) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  const renderValue = ({ data }: { data: Option }) => {
    return data.account ? (
      <AccountOption account={data.account} subAccount={data.subAccount} isValue />
    ) : null;
  };

  const renderOption = ({ data }: { data: Option }) => {
    return data.account ? (
      <AccountOption account={data.account} subAccount={data.subAccount} disabled={!data.matched} />
    ) : null;
  };

  const onChangeCallback = useCallback(
    (option?: Option) => {
      if (option) {
        onChange(option.account, option.subAccount);
      } else {
        onChange(null, null);
      }
    },
    [onChange],
  );

  const manualFilter = useCallback(
    () =>
      accounts.reduce((result, option) => {
        const [display, match] = filterOption({})({ data: option.account }, searchInputValue);

        if (display) {
          result.push({
            matched: match,
            account: option.account,
            subAccount: option.subAccount,
          });
        }
        return result;
      }, []),
    [searchInputValue, accounts],
  );
  const structuredResults = manualFilter();
  return (
    <Select
      {...props}
      virtual={false}
      value={value}
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

export const SelectAccount: React$ComponentType<OwnProps> = withTranslation()(RawSelectAccount);

const m: React$ComponentType<OwnProps> = connect(mapStateToProps)(SelectAccount);

export default m;

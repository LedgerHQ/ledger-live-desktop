// @flow

import {
  flattenAccounts,
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
  listSubAccounts,
} from "@ledgerhq/live-common/lib/account";
import type { TFunction } from "react-i18next";
import type { AccountLike, Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import styled from "styled-components";
import React, { useCallback, useState } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { createFilter } from "react-select";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import Select from "~/renderer/components/Select";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";

const mapStateToProps = (state, { accounts }) => ({
  accounts: accounts || shallowAccountsSelector(state),
});

const Tick = styled.div`
  position: absolute;
  top: -10px;
  height: 40px;
  width: 1px;
  background: ${p => p.theme.colors.palette.divider};
`;

const tokenTick = (
  <div
    style={{
      padding: "0px 6px",
    }}
  >
    <Tick />
  </div>
);

type Option = {
  matched: "boolean",
  account: Account | TokenAccount,
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
  const { filter } = o;
  const passesFilter = c => !filter || filter(c);
  const selfMatches = defaultFilter(candidate, input) && passesFilter(candidate.data);
  if (selfMatches) return [selfMatches, true];

  if (candidate.data.type === "Account" && o.withSubAccounts) {
    const subAccounts = o.enforceHideEmptySubAccounts
      ? listSubAccounts(candidate.data)
      : candidate.data.subAccounts;
    if (subAccounts) {
      for (let i = 0; i < subAccounts.length; i++) {
        const ta = subAccounts[i];
        if (passesFilter(ta) && defaultFilter({ value: ta.id, data: ta }, input)) {
          return [true, false];
        }
      }
    }
  }
  return [false, false];
};

const AccountOption = React.memo(function AccountOption({
  account,
  isValue,
  disabled,
  hideAmount,
}: {
  account: AccountLike,
  isValue?: boolean,
  disabled?: boolean,
  hideAmount?: boolean,
}) {
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const name = getAccountName(account);
  const nested = ["TokenAccount", "ChildAccount"].includes(account.type);
  return (
    <Box grow horizontal alignItems="center" flow={2} style={{ opacity: disabled ? 0.2 : 1 }}>
      {!isValue && nested ? tokenTick : null}
      <CryptoCurrencyIcon currency={currency} size={16} />
      <div style={{ flex: 1 }}>
        <Ellipsis ff="Inter|SemiBold" fontSize={4}>
          {name}
        </Ellipsis>
      </div>
      {!hideAmount ? (
        <Box>
          <FormattedVal
            color="palette.text.shade60"
            val={account.balance}
            unit={unit}
            showCode
            disableRounding
          />
        </Box>
      ) : null}
    </Box>
  );
});

const renderValue = hideAmount => ({ data }: { data: Option }) =>
  data.account ? <AccountOption hideAmount={hideAmount} account={data.account} isValue /> : null;

const renderOption = hideAmount => ({ data }: { data: Option }) =>
  data.account ? (
    <AccountOption hideAmount={hideAmount} account={data.account} disabled={!data.matched} />
  ) : null;

type OwnProps = {
  hideBalance?: boolean,
  withSubAccounts?: boolean,
  enforceHideEmptySubAccounts?: boolean,
  enhance?: Account => Account,
  filter?: AccountLike => boolean,
  onChange: (account: ?AccountLike, tokenAccount: ?Account) => void,
  value: ?AccountLike,
  hideAmount?: boolean,
};

type Props = OwnProps & {
  accounts: Account[],
};

const RawSelectAccount = ({
  accounts,
  onChange,
  value,
  withSubAccounts,
  enforceHideEmptySubAccounts,
  filter,
  hideAmount,
  enhance,
  t,
  ...props
}: Props & { t: TFunction }) => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const mappedAccounts = enhance ? accounts.map(enhance) : accounts;

  const all = withSubAccounts
    ? flattenAccounts(mappedAccounts, { enforceHideEmptySubAccounts })
    : mappedAccounts;

  const selectedOption = value
    ? {
        account: all.find(o => o.id === value.id),
      }
    : null;
  const onChangeCallback = useCallback(
    (option?: Option) => {
      if (!option) {
        onChange(null);
      } else {
        const { account } = option;
        const parentAccount =
          account.type !== "Account" ? mappedAccounts.find(a => a.id === account.parentId) : null;
        onChange(account, parentAccount);
      }
    },
    [mappedAccounts, onChange],
  );

  const manualFilter = useCallback(
    () =>
      all.reduce((result, option) => {
        const [display, match] = filterOption({
          withSubAccounts,
          enforceHideEmptySubAccounts,
          filter,
        })({ data: option }, searchInputValue);

        if (display) {
          result.push({
            matched: match,
            account: option,
          });
        }
        return result;
      }, []),
    [filter, searchInputValue, all, withSubAccounts, enforceHideEmptySubAccounts],
  );

  const structuredResults = manualFilter();
  return (
    <Select
      {...props}
      value={selectedOption}
      options={structuredResults}
      getOptionValue={getOptionValue}
      renderValue={renderValue(hideAmount)}
      renderOption={renderOption(hideAmount)}
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

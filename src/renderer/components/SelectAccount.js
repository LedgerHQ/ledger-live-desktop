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
import React, { useCallback, useState, useMemo } from "react";
import { withTranslation, Trans } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { createFilter, components } from "react-select";
import { createStructuredSelector } from "reselect";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import Select from "~/renderer/components/Select";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import AccountTagDerivationMode from "./AccountTagDerivationMode";
import Button from "~/renderer/components//Button";
import Plus from "~/renderer/icons/Plus";
import Text from "./Text";
import { openModal } from "../actions/modals";

const mapStateToProps = createStructuredSelector({
  accounts: shallowAccountsSelector,
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

export type Option = {
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
  const selfMatches = defaultFilter(candidate, input);
  if (selfMatches) return [selfMatches, true];

  if (candidate.data.type === "Account" && o.withSubAccounts) {
    const subAccounts = o.enforceHideEmptySubAccounts
      ? listSubAccounts(candidate.data)
      : candidate.data.subAccounts;
    if (subAccounts) {
      for (let i = 0; i < subAccounts.length; i++) {
        const ta = subAccounts[i];
        if (defaultFilter({ value: ta.id, data: ta }, input)) {
          return [true, false];
        }
      }
    }
  }
  return [false, false];
};

type AccountOptionProps = {
  account: AccountLike,
  isValue?: boolean,
  disabled?: boolean,
};
export const AccountOption = React.memo<AccountOptionProps>(function AccountOption({
  account,
  isValue,
  disabled,
}: AccountOptionProps) {
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const name = getAccountName(account);
  const nested = ["TokenAccount", "ChildAccount"].includes(account.type);
  const balance =
    account.type !== "ChildAccount" && account.spendableBalance
      ? account.spendableBalance
      : account.balance;

  return (
    <Box grow horizontal alignItems="center" flow={2} style={{ opacity: disabled ? 0.2 : 1 }}>
      {!isValue && nested ? tokenTick : null}
      <CryptoCurrencyIcon currency={currency} size={16} />
      <Box flex="1" horizontal alignItems="center">
        <Box flex="0 1 auto">
          <Ellipsis ff="Inter|SemiBold" fontSize={4}>
            {name}
          </Ellipsis>
        </Box>
        <AccountTagDerivationMode account={account} />
      </Box>
      <Box>
        <FormattedVal color="palette.text.shade60" val={balance} unit={unit} showCode />
      </Box>
    </Box>
  );
});

const AddAccountContainer = styled(Box)`
  // to prevent ScrollBlock.js (used by react-select under the hood) css stacking context issues
  position: relative;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  padding: ${p => (p.small ? "8px 15px 8px 15px" : "10px 15px 11px 15px")};
`;
const RoundButton = styled(Button)`
  padding: 6px;
  border-radius: 9999px;
  height: initial;
`;
function AddAccountButton() {
  return (
    <RoundButton lighterPrimary>
      <Plus size={12} />
    </RoundButton>
  );
}
const AddAccountFooter = (small?: boolean) =>
  function AddAccountFooter({ children, ...props }: { children?: React$Node }) {
    const dispatch = useDispatch();
    const openAddAccounts = useCallback(() => {
      dispatch(openModal("MODAL_ADD_ACCOUNTS"));
    }, [dispatch]);

    return (
      <>
        <components.MenuList {...props}>{children}</components.MenuList>
        <AddAccountContainer small={small} onClick={openAddAccounts}>
          <Box mr={3}>
            <AddAccountButton />
          </Box>
          <Text ff="Inter|SemiBold" color="palette.primary.main" fontSize={3}>
            <Trans i18nKey="swap2.form.details.noAccountCTA" />
          </Text>
        </AddAccountContainer>
      </>
    );
  };
const extraAddAccountRenderer = (small?: boolean) => ({
  MenuList: AddAccountFooter(small),
});

const defaultRenderValue = ({ data }: { data: Option }) =>
  data.account ? <AccountOption account={data.account} isValue /> : null;

const defaultRenderOption = ({ data }: { data: Option }) =>
  data.account ? <AccountOption account={data.account} disabled={!data.matched} /> : null;

type OwnProps = {
  withSubAccounts?: boolean,
  enforceHideEmptySubAccounts?: boolean,
  filter?: Account => boolean,
  onChange: (account: ?AccountLike, tokenAccount: ?Account) => void,
  value: ?AccountLike,
  renderValue?: typeof defaultRenderValue,
  renderOption?: typeof defaultRenderOption,
  placeholder?: string,
  showAddAccount?: boolean,
  disableTooltipText?: string,
};

type Props = OwnProps & {
  accounts: Account[],
  small?: boolean,
};

export const RawSelectAccount = ({
  accounts,
  onChange,
  value,
  withSubAccounts,
  enforceHideEmptySubAccounts,
  filter,
  renderValue,
  renderOption,
  placeholder,
  showAddAccount = false,
  disableTooltipText,
  t,
  ...props
}: Props & { t: TFunction }) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  const filtered: Account[] = filter ? accounts.filter(filter) : accounts;
  const all = withSubAccounts
    ? flattenAccounts(filtered, { enforceHideEmptySubAccounts })
    : filtered;

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
          account.type !== "Account" ? accounts.find(a => a.id === account.parentId) : null;
        onChange(account, parentAccount);
      }
    },
    [accounts, onChange],
  );

  const manualFilter = useCallback(
    () =>
      all.reduce((result, option) => {
        const [display, match] = filterOption({ withSubAccounts, enforceHideEmptySubAccounts })(
          { data: option },
          searchInputValue,
        );

        if (display) {
          result.push({
            matched: match && !option.disabled,
            account: option,
          });
        }
        return result;
      }, []),
    [searchInputValue, all, withSubAccounts, enforceHideEmptySubAccounts],
  );
  const extraRenderers = useMemo(() => {
    let extraProps = {};

    if (showAddAccount) extraProps = { ...extraProps, ...extraAddAccountRenderer(props.small) };
    if (disableTooltipText) extraProps = { ...extraProps, disableTooltipText };

    return extraProps;
  }, [showAddAccount, props.small, disableTooltipText]);

  const structuredResults = manualFilter();
  return (
    <Select
      {...props}
      value={selectedOption}
      options={structuredResults}
      getOptionValue={getOptionValue}
      renderValue={renderValue || defaultRenderValue}
      renderOption={renderOption || defaultRenderOption}
      onInputChange={v => setSearchInputValue(v)}
      inputValue={searchInputValue}
      filterOption={false}
      isOptionDisabled={option => !option.matched}
      placeholder={placeholder || t("common.selectAccount")}
      noOptionsMessage={({ inputValue }) =>
        t("common.selectAccountNoOption", { accountName: inputValue })
      }
      onChange={onChangeCallback}
      extraRenderers={extraRenderers}
    />
  );
};

export const SelectAccount: React$ComponentType<Props> = withTranslation()(RawSelectAccount);

const m: React$ComponentType<OwnProps> = connect(mapStateToProps)(SelectAccount);

export default m;

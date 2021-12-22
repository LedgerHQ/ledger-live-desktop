import React, { useCallback, useState } from "react";

import SelectInput, {
  Props as SelectInputProps,
} from "@ledgerhq/react-ui/components/form/SelectInput";
import { Text, Flex, Box, Button } from "@ledgerhq/react-ui";
import { Option as SelectOption } from "@ledgerhq/react-ui/components/form/SelectInput/Option";
import { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import {
  flattenAccounts,
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
  listSubAccounts,
} from "@ledgerhq/live-common/lib/account";
import { Trans, useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled, { useTheme } from "styled-components";

import CryptoCurrencyIcon from "./CryptoCurrencyIcon";
import FormattedVal from "./FormattedVal";
import AccountTagDerivationMode from "./AccountTagDerivationMode";
import { shallowAccountsSelector } from "../reducers/accounts";
import { openModal } from "../actions/modals";
import Plus from "../icons/Plus";

// TODO: update react-select just before V3 gets merged instead of relying on a nested version…
import {
  components,
  createFilter,
  MenuListProps,
  OptionProps,
  SingleValueProps,
  ControlProps,
  IndicatorsContainerProps,
} from "@ledgerhq/react-ui/node_modules/react-select";

const IndentLine = styled.div`
  height: 36px;
  width: 1px;
  background: ${p => p.theme.colors.neutral.c70};
  margin: 0 8px;
`;

type SelectOption = {
  matched: boolean;
  account: AccountLike;
};

type AccountOptionProps = {
  account: AccountLike;
  isSelectedValue?: boolean;
  hideDerivationTag?: boolean;
};

export const AccountOption = ({
  account,
  isSelectedValue = false,
  hideDerivationTag = false,
}: AccountOptionProps) => {
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const name = getAccountName(account);
  const nested = ["TokenAccount", "ChildAccount"].includes(account.type);
  const balance =
    account.type !== "ChildAccount" && account.spendableBalance
      ? account.spendableBalance
      : account.balance;

  return (
    <Flex flexGrow={1} alignItems="center" columnGap={4} height={48}>
      {!isSelectedValue && nested ? <IndentLine /> : null}
      {!isSelectedValue && (
        <Text color="neutral.c100">
          <CryptoCurrencyIcon currency={currency} size={16} />
        </Text>
      )}
      <Text flex={1} variant="body" fontWeight="medium" color="inherit" fontSize={4}>
        {name}
      </Text>
      {!hideDerivationTag && <AccountTagDerivationMode account={account} />}
      {!isSelectedValue && unit && balance && (
        <Text color="neutral.c100" mr={4}>
          <FormattedVal
            color="palette.text.shade40"
            variant="body"
            fontWeight="medium"
            fontSize={3}
            val={balance}
            unit={unit}
            showCode
          />
        </Text>
      )}
    </Flex>
  );
};

const defaultRenderOption = (props: OptionProps<SelectOption, false>) => {
  return (
    <SelectOption {...props} render={({ data }) => <AccountOption account={data?.account} />} />
  );
};

const defaultRenderValue = (props: SingleValueProps<SelectOption, false>) => {
  const selectedOption = props.getValue()[0];

  if (!selectedOption) {
    return null;
  }

  return (
    <components.SingleValue {...props}>
      <AccountOption account={selectedOption.account} isSelectedValue />
    </components.SingleValue>
  );
};

const AddAccountContainer = styled(Box)`
  position: relative;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.neutral.c40};
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  background: ${p => p.theme.colors.background.main};
`;

const AddButton = styled(Button.Unstyled)`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${p => p.theme.colors.primary.c20};
  }
  &:active {
    background-color: ${p => p.theme.colors.primary.c30};
  }
`;

const AddAccountFooter = (props: MenuListProps<SelectOption, false>) => {
  const dispatch = useDispatch();
  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS", null));
  }, [dispatch]);

  return (
    <>
      <components.MenuList {...props} />
      <AddAccountContainer>
        <AddButton onClick={openAddAccounts}>
          <Text color="neutral.c80">
            <Plus size={12} />
            <Box as="span" ml={4}>
              <Trans i18nKey="swap2.form.details.noAccountCTA" />
            </Box>
          </Text>
        </AddButton>
      </AddAccountContainer>
    </>
  );
};

const getAccountFromProps = (
  props: ControlProps<SelectOption> | IndicatorsContainerProps<SelectOption>,
): AccountLike | null => {
  const selectedOption = props.getValue()[0];

  if (!selectedOption) {
    return null;
  }

  return selectedOption.account ?? null;
};

const renderLeft = (props: ControlProps<SelectOption>) => {
  const account = getAccountFromProps(props);

  if (!account) {
    return null;
  }

  const currency = getAccountCurrency(account);

  return (
    currency && (
      <Text color="neutral.c00" ml={-2} mr={2}>
        <CryptoCurrencyIcon circle currency={currency} size={24} />
      </Text>
    )
  );
};

const renderRight = (props: IndicatorsContainerProps<SelectOption>) => {
  const account = getAccountFromProps(props);

  if (!account) {
    return null;
  }

  const unit = getAccountUnit(account);
  const balance =
    account.type !== "ChildAccount" && account.spendableBalance
      ? account.spendableBalance
      : account.balance;

  return (
    unit &&
    balance && (
      <Text color="neutral.c00" mr={4}>
        <FormattedVal
          color="palette.text.shade40"
          variant="body"
          fontSize={3}
          fontWeight="medium"
          val={balance}
          unit={unit}
          showCode
        />
      </Text>
    )
  );
};

const defaultFilter = createFilter<AccountLike>({
  stringify: ({ data: account }) => {
    const currency = getAccountCurrency(account);
    const name = getAccountName(account);
    return `${currency.ticker}|${currency.name}|${name}`;
  },
});

const filterOption = (o: { withSubAccounts?: boolean; enforceHideEmptySubAccounts?: boolean }) => (
  candidate: { value: string; data: AccountLike; label: string },
  input: string,
) => {
  const selfMatches = defaultFilter(candidate, input);
  if (selfMatches) return [selfMatches, true];

  if (candidate.data.type === "Account" && o.withSubAccounts) {
    const subAccounts = o.enforceHideEmptySubAccounts
      ? listSubAccounts(candidate.data)
      : candidate.data.subAccounts;

    if (subAccounts) {
      for (let i = 0; i < subAccounts.length; i++) {
        const ta = subAccounts[i];
        if (defaultFilter({ value: ta.id, data: ta, label: ta.id }, input)) {
          return [true, false];
        }
      }
    }
  }
  return [false, false];
};

type OwnProps = {
  value?: AccountLike;
  onChange: (account?: AccountLike | null, tokenAccount?: Account | null) => void;
  filter?: (account: Account) => boolean;
  renderOption?: typeof defaultRenderOption;
  renderValue?: typeof defaultRenderValue;
  disabledTooltipText?: string;
  showAddAccount?: boolean;
  enforceHideEmptySubAccounts?: boolean;
  withSubAccounts?: boolean;
} & Omit<SelectInputProps, "onChange">;

type Props = OwnProps & {
  accounts: Account[];
  small?: boolean;
};

const SelectAccount = ({
  accounts,
  value,
  onChange,
  withSubAccounts,
  enforceHideEmptySubAccounts,
  renderOption,
  renderValue,
  placeholder,
  autoFocus,
  filter,
  showAddAccount = false,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchInputValue, setSearchInputValue] = useState("");

  const filtered: Account[] = filter ? accounts.filter(filter) : accounts;
  const all = withSubAccounts
    ? flattenAccounts(filtered, { enforceHideEmptySubAccounts })
    : filtered;

  const selectedAccount = value ? all.find(o => o.id === value.id) : null;
  const selectedOption: SelectOption | null = selectedAccount
    ? { account: selectedAccount, matched: false }
    : null;

  const handleChange = useCallback(
    (option?: SelectOption | null) => {
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
      all.reduce<SelectOption[]>((result, option) => {
        const [display, match] = filterOption({ withSubAccounts, enforceHideEmptySubAccounts })(
          { value: option.id, label: option.id, data: option },
          searchInputValue,
        );

        if (display) {
          result.push({
            matched: match,
            account: option,
          });
        }
        return result;
      }, []),
    [searchInputValue, all, withSubAccounts, enforceHideEmptySubAccounts],
  );

  const structuredResults: SelectOption[] = manualFilter();

  const baseRenderers = {
    Option: renderOption ?? defaultRenderOption,
    SingleValue: renderValue ?? defaultRenderValue,
  };

  const allRenderers = showAddAccount
    ? { ...baseRenderers, MenuList: AddAccountFooter }
    : baseRenderers;

  return (
    <SelectInput
      value={selectedOption}
      options={structuredResults}
      getOptionValue={o => o.account?.id}
      onChange={handleChange}
      components={allRenderers}
      inputValue={searchInputValue}
      onInputChange={setSearchInputValue}
      placeholder={placeholder || t("common.selectAccount")}
      isOptionDisabled={o => !o.matched}
      autoFocus={!process.env.SPECTRON_RUN ? autoFocus : false}
      noOptionsMessage={({ inputValue }) =>
        t("common.selectAccountNoOption", { accountName: inputValue })
      }
      menuPortalTarget={document.body}
      renderLeft={renderLeft}
      renderRight={renderRight}
      extendStyles={styles => ({
        ...styles,
        menuPortal: (provided, state) => ({
          ...((styles.menuPortal && styles.menuPortal(provided, state)) || { ...provided }),
          zIndex: theme.zIndexes[8],
        }),
        menu: (provided, state) => ({
          ...((styles.menu && styles.menu(provided, state)) || { ...provided }),
          marginTop: `${theme.space[5]}px`,
          border: `1px solid ${theme.colors.neutral.c40}`,
          borderRadius: 8,
        }),
        singleValue: (provided, state) => ({
          ...((styles.singleValue && styles.singleValue(provided, state)) || { ...provided }),
          width: "100%",
        }),
      })}
    />
  );
};

const mapStateToProps = createStructuredSelector({
  accounts: shallowAccountsSelector,
});

const ConnectedSelectAccount = connect(mapStateToProps)(SelectAccount);

export default ConnectedSelectAccount;

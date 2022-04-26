import React, { Component } from "react";
import { withTranslation, TFunction, Trans } from "react-i18next";
import { Account, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { Flex, Text } from "@ledgerhq/react-ui";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import Link from "~/renderer/components/Link";
import { SpoilerIcon } from "~/renderer/components/Spoiler";
import { openURL } from "~/renderer/linking";
import AccountRow from "./AccountRow";

type Props = {
  accounts: Account[];
  currency?: CryptoCurrency | TokenCurrency;
  checkedIds?: string[];
  editedNames: { [accountId: string]: string };
  setAccountName?: (arg0: Account, arg1: string) => void;
  onToggleAccount?: (arg: Account) => void;
  onSelectAll?: (arg: Account[]) => void;
  onUnselectAll?: (arg: Account[]) => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  emptyText?: React.ReactNode;
  autoFocusFirstInput?: boolean;
  collapsible?: boolean;
  hideAmount?: boolean;
  supportLink?: { id: any; url: string };
  t: TFunction;
  ToggleAllComponent?: React.ReactNode;
};

type State = { collapsed: boolean };

class AccountsList extends Component<Props, State> {
  static defaultProps = {
    editedNames: {},
  };

  state = {
    collapsed: !!this.props.collapsible,
  };

  toggleCollapse = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  onSelectAll = () => {
    const { accounts, onSelectAll } = this.props;
    if (onSelectAll) onSelectAll(accounts);
  };

  onUnselectAll = () => {
    const { accounts, onUnselectAll } = this.props;
    if (onUnselectAll) onUnselectAll(accounts);
  };

  render() {
    const {
      accounts,
      currency,
      checkedIds,
      onToggleAccount,
      editedNames,
      setAccountName,
      onSelectAll,
      onUnselectAll,
      title,
      subtitle,
      emptyText,
      autoFocusFirstInput,
      collapsible,
      hideAmount,
      supportLink,
      t,
      ToggleAllComponent,
    } = this.props;
    const { collapsed } = this.state;
    const withToggleAll = !!onSelectAll && !!onUnselectAll && accounts.length > 1;
    const isAllSelected =
      !checkedIds || accounts.every(acc => !!checkedIds.find(id => acc.id === id));
    return (
      <Flex flexDirection="column"  rowGap={3}>
        {(title || withToggleAll) && (
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Flex flexDirection="row" alignItems="center">
              {title && (
                <Flex
                  flexDirection="row"
                  justifyContent="space-between"
                  cursor={collapsible ? "pointer" : undefined}
                  onClick={collapsible ? this.toggleCollapse : undefined}
                >
                  {collapsible ? <SpoilerIcon isOpened={!collapsed} mr={1} /> : null}
                  <Text variant="subtitle" fontWeight="semiBold" color="palette.neutral.c100">
                    {title}
                  </Text>
                </Flex>
              )}
              {supportLink ? (
                <LinkWithExternalIcon
                  fontSize={2}
                  onClick={() => openURL(supportLink.url)}
                  label={t("addAccounts.supportLinks." + supportLink.id)}
                />
              ) : null}
            </Flex>
            {ToggleAllComponent ||
              (withToggleAll && (
                <Link onClick={isAllSelected ? this.onUnselectAll : this.onSelectAll}>
                  {isAllSelected ? (
                    <Trans i18nKey="addAccounts.unselectAll" values={{ count: accounts.length }} />
                  ) : (
                    <Trans i18nKey="addAccounts.selectAll" values={{ count: accounts.length }} />
                  )}
                </Link>
              ))}
          </Flex>
        )}
        {subtitle && (
          <Text variant="paragraph" fontWeight="medium" color="palette.neutral.c80">
            {subtitle}
          </Text>
        )}
        {collapsed ? null : accounts.length ? (
          <Flex flexDirection="column" rowGap={2} id="accounts-list-selectable">
            {accounts.map((account, i) => (
              <AccountRow
                key={account.id}
                account={account}
                currency={currency}
                autoFocusInput={i === 0 && autoFocusFirstInput}
                isDisabled={!onToggleAccount || !checkedIds}
                isChecked={!checkedIds || checkedIds.find(id => id === account.id) !== undefined}
                onToggleAccount={onToggleAccount}
                onEditName={setAccountName}
                hideAmount={hideAmount}
                accountName={
                  typeof editedNames[account.id] === "string"
                    ? editedNames[account.id]
                    : account.name
                }
              />
            ))}
          </Flex>
        ) : emptyText ? (
          <Text>{emptyText}</Text>
        ) : null}
      </Flex>
    );
  }
}

export default withTranslation()(AccountsList);

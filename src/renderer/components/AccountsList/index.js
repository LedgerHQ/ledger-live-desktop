// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { Account, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import FakeLink from "~/renderer/components/FakeLink";
import { SpoilerIcon } from "~/renderer/components/Spoiler";
import AccountRow from "./AccountRow";

interface Props {
  accounts: Account[];
  currency?: CryptoCurrency | TokenCurrency;
  checkedIds?: string[];
  editedNames: { [accountId: string]: string };
  setAccountName?: (Account, string) => void;
  onToggleAccount?: Account => void;
  onSelectAll?: (Account[]) => void;
  onUnselectAll?: (Account[]) => void;
  title?: React$Node;
  emptyText?: React$Node;
  autoFocusFirstInput?: boolean;
  collapsible?: boolean;
  hideAmount?: boolean;
}

export default function AccountsList({
  accounts,
  currency,
  checkedIds,
  onToggleAccount,
  editedNames = {},
  setAccountName,
  onSelectAll,
  onUnselectAll,
  title,
  emptyText,
  autoFocusFirstInput,
  collapsible,
  hideAmount,
}) {
  const collapsed = useState(collapsible);
  const { t } = useTranslation();

  function toggleCollapse() {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  }

  function onSelectAll() {
    const { accounts, onSelectAll } = this.props;
    if (onSelectAll) onSelectAll(accounts);
  }

  function onUnselectAll() {
    const { accounts, onUnselectAll } = this.props;
    if (onUnselectAll) onUnselectAll(accounts);
  }

  const withToggleAll = !!onSelectAll && !!onUnselectAll && accounts.length > 1;
  const isAllSelected =
    !checkedIds || accounts.every(acc => !!checkedIds.find(id => acc.id === id));
  return (
    <Box flow={3} mt={4}>
      {(title || withToggleAll) && (
        <Box horizontal alignItems="center">
          {title && (
            <Box
              horizontal
              ff="Inter|Bold"
              color="palette.text.shade100"
              fontSize={2}
              textTransform="uppercase"
              cursor={collapsible ? "pointer" : undefined}
              onClick={collapsible ? this.toggleCollapse : undefined}
            >
              {collapsible ? <SpoilerIcon isOpened={!collapsed} mr={1} /> : null}
              {title}
            </Box>
          )}
          {withToggleAll && (
            <FakeLink
              ml="auto"
              ff="Inter|Regular"
              onClick={isAllSelected ? this.onUnselectAll : this.onSelectAll}
              fontSize={3}
              style={{ lineHeight: "10px" }}
            >
              {isAllSelected
                ? t("addAccounts.unselectAll", { count: accounts.length })
                : t("addAccounts.selectAll", { count: accounts.length })}
            </FakeLink>
          )}
        </Box>
      )}
      {collapsed ? null : accounts.length ? (
        <Box flow={2}>
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
                typeof editedNames[account.id] === "string" ? editedNames[account.id] : account.name
              }
            />
          ))}
        </Box>
      ) : emptyText ? (
        <Box ff="Inter|Regular" fontSize={3}>
          {emptyText}
        </Box>
      ) : null}
    </Box>
  );
}

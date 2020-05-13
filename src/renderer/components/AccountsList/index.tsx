import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import type { Account, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
// @ts-ignore
import Box from "../Box";
// @ts-ignore
import FakeLink from "../FakeLink";
// @ts-ignore
import { SpoilerIcon } from "../Spoiler";
import AccountRow from "./AccountRow";

interface Props {
  // [TODO] accounts: Account[];
  accounts: any[];
  // [TODO] currency?: CryptoCurrency | TokenCurrency;
  currency?: any;
  checkedIds?: string[];
  editedNames: { [accountId: string]: string };
  // [TODO] setAccountName?: (account: Account, name: string) => void;
  setAccountName?: (account: Account, name: string) => void;
  // [TODO] onToggleAccount?: (account: Account) => void;
  onToggleAccount?: (account: any) => void;
  // [TODO] onSelectAll?: (accounts: Account[]) => void;
  onSelectAll?: (accounts: any[]) => void;
  // [TODO] onUnselectAll?: (accounts: Account[]) => void;
  onUnselectAll?: (accounts: any[]) => void;
  title?: React.ReactNode;
  emptyText?: React.ReactNode;
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
  onSelectAll: onSelectAllProp,
  onUnselectAll: onUnselectAllProp,
  title,
  emptyText,
  autoFocusFirstInput,
  collapsible,
  hideAmount,
}: Props) {
  const [collapsed, setCollapsed] = useState(collapsible);
  const { t } = useTranslation();

  function toggleCollapse() {
    setCollapsed(!collapsed);
  }

  function onSelectAll() {
    if (onSelectAllProp) onSelectAllProp(accounts);
  }

  function onUnselectAll() {
    if (onUnselectAllProp) onUnselectAllProp(accounts);
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
              onClick={collapsible ? toggleCollapse : undefined}
            >
              {collapsible ? <SpoilerIcon isOpened={!collapsed} mr={1} /> : null}
              {title}
            </Box>
          )}
          {withToggleAll && (
            <FakeLink
              ml="auto"
              ff="Inter|Regular"
              onClick={isAllSelected ? onUnselectAll : onSelectAll}
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
              autoFocusInput={i === 0 && autoFocusFirstInput}
              isDisabled={!onToggleAccount || !checkedIds}
              isChecked={!checkedIds || checkedIds.find(id => id === account.id) !== undefined}
              onToggleAccount={onToggleAccount}
              onEditName={setAccountName}
              hideAmount={hideAmount}
              accountName={
                typeof editedNames[account.id] === "string"
                  ? editedNames[account.id]
                  : (account.name as string)
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

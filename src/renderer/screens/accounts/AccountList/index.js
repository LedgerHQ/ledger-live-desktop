// @flow
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getAccountCurrency,
  getAccountName,
  listSubAccounts,
} from "@ledgerhq/live-common/lib/account/helpers";
import type {
  Account,
  AccountLike,
  AccountLikeArray,
  TokenAccount,
} from "@ledgerhq/live-common/lib/types";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import Text from "~/renderer/components/Text";
import { GenericBox } from "../index";
import SearchBox from "./SearchBox";
import DisplayOptions from "./DisplayOptions";
import GridBody from "./GridBody";
import ListBody from "./ListBody";

type Props = {
  accounts: AccountLikeArray,
  mode: *,
  onAccountClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
};

export default function AccountList({ accounts, range, onAccountClick, mode }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const lookupParentAccount = useCallback(
    (id: string): ?Account => {
      for (const a of accounts) {
        if (a.type === "Account" && a.id === id) {
          return a;
        }
      }
      return null;
    },
    [accounts],
  );

  const onTextChange = useCallback((evt: SyntheticInputEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  }, []);
  const Body = BodyByMode[mode];

  const visibleAccounts = [];
  const hiddenAccounts = [];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    if (matchesSearch(search, account, mode === "list")) {
      visibleAccounts.push(account);
    } else {
      hiddenAccounts.push(account);
    }
  }

  return (
    <div style={{ paddingBottom: 70 }}>
      <GenericBox horizontal p={0} alignItems="center">
        <SearchBox
          id={"accounts-search-input"}
          autoFocus
          onTextChange={onTextChange}
          search={search}
        />
        <DisplayOptions />
      </GenericBox>
      {visibleAccounts.length === 0 ? (
        <Text style={{ display: "block", padding: 60, textAlign: "center" }}>
          {t("accounts.noResultFound")}
        </Text>
      ) : null}
      <Body
        horizontal
        range={range}
        search={search}
        visibleAccounts={visibleAccounts}
        hiddenAccounts={hiddenAccounts}
        showNewAccount={!search}
        onAccountClick={onAccountClick}
        lookupParentAccount={lookupParentAccount}
      />
    </div>
  );
}

const BodyByMode = {
  card: GridBody,
  list: ListBody,
};

export const matchesSearch = (
  search?: string,
  account: AccountLike,
  subMatch: boolean = false,
): boolean => {
  if (!search) return true;
  let match;

  if (account.type === "Account") {
    match = `${account.currency.ticker}|${account.currency.name}|${getAccountName(account)}`;
    subMatch =
      subMatch &&
      !!account.subAccounts &&
      listSubAccounts(account).some(token => matchesSearch(search, token));
  } else {
    const c = getAccountCurrency(account);
    match = `${c.ticker}|${c.name}|${getAccountName(account)}`;
  }

  return match.toLowerCase().includes(search.toLowerCase()) || subMatch;
};

// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";
import {
  getAccountCurrency,
  getAccountName,
  listSubAccounts,
} from "@ledgerhq/live-common/lib/account/helpers";
import type {
  Account,
  AccountLike,
  PortfolioRange,
  TokenAccount,
} from "@ledgerhq/live-common/lib/types";

import Text from "~/renderer/components/Text";

import { GenericBox } from "../index";
import SearchBox from "./SearchBox";
import DisplayOptions from "./DisplayOptions";
import GridBody from "./GridBody";
import ListBody from "./ListBody";

type Props = {
  accounts: (Account | TokenAccount)[],
  mode: *,
  onModeChange: (*) => void,
  onRangeChange: PortfolioRange => void,
  onAccountClick: (Account | TokenAccount, ?Account) => void,
  range: PortfolioRange,
};

type State = {
  search: string,
};

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

class AccountList extends Component<Props, State> {
  state = {
    search: "",
  };

  lookupParentAccount = (id: string): ?Account => {
    for (const a of this.props.accounts) {
      if (a.type === "Account" && a.id === id) {
        return a;
      }
    }
    return null;
  };

  onTextChange = (evt: SyntheticInputEvent<HTMLInputElement>) =>
    this.setState({
      search: evt.target.value,
    });

  render() {
    const { accounts, range, onAccountClick, onModeChange, onRangeChange, mode } = this.props;
    const { search } = this.state;
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
          <SearchBox onTextChange={this.onTextChange} search={search} />
          <DisplayOptions
            onModeChange={onModeChange}
            onRangeChange={onRangeChange}
            mode={mode}
            range={range}
          />
        </GenericBox>
        {visibleAccounts.length === 0 ? (
          <Text style={{ display: "block", padding: 60, textAlign: "center" }}>
            <Trans i18nKey="accounts.noResultFound" />
          </Text>
        ) : null}
        <Body
          horizontal
          data-e2e="dashboard_AccountList"
          range={range}
          search={search}
          visibleAccounts={visibleAccounts}
          hiddenAccounts={hiddenAccounts}
          showNewAccount={!search}
          onAccountClick={onAccountClick}
          lookupParentAccount={this.lookupParentAccount}
        />
      </div>
    );
  }
}

export default AccountList;
